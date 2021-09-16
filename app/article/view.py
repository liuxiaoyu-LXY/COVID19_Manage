import base64
from app.extends import avatars
from flask import Blueprint,flash, jsonify, redirect, render_template,request, url_for, g
bp = Blueprint("article", __name__)
from app.extends import db
from app.user.model import User2
from app.article.model import *
from app.utils import *
import os
import time
import boto3
s3_client = boto3.client('s3')
s3 = boto3.resource('s3')
BUCKET = "medicalbucket123"
APP_ROOT = os.path.dirname(os.path.abspath(__file__))

@bp.before_app_request
def before_request():
    token = request.cookies.get("z-token",None)
    # 拿到token，去换取用户信息
    user = verify_token(token)
    if user:
        g.user = user.id
@bp.route('/publish2',methods=['POST'])
def publish2():
    titles = request.form.get('title')
    titlearr = titles.split(',')



@bp.route('/publish',methods=['GET','POST'])
def publish():
    if 'user' in g:
        user = User2.query.get(g.user)
    else:
        user = None
    if request.method == 'POST':

        files = request.files.getlist('files')
        title = request.form.get('title')
        content =  request.form.get('content')
        author = g.user
        username = User2.query.get(author)
        typeid=request.form.get('type')
        profile_image = []
        for image in files:
            profile_image.append(save_image(username, image))


        article = Article()
        article.user_id = author
        article.type_id = typeid
        article.title = title
        article.content = content
        db.session.add(article)
        db.session.commit()
        idtemp = article.id

        for item in profile_image:
            print('hihihihihi',item)
            images = imgs()
            images.imgbase = item
            images.article_id = idtemp
            db.session.add(images)
        db.session.commit()



        return jsonify(
            {"isSuccess":True,
             "url":"/explore"
             }
        )


    else:
        users = User2.query.filter(User2.isdelete==False).all()
        typesall = types.query.all()
        return render_template('article/add.html',users=users,types = typesall,user=user)

def save_image(username, image):
    extension = image.filename.split('.')[-1]


    assert extension.lower() in set(
        ["bmp", "pbm", "pgm", "ppm", "sr", "ras", "jpeg", "jpg", "jpe", "jp2", "tiff", "tif", "png"]), \
        "Unsupported format "

    timestamp = str(int(time.time()))
    filename = str(username) + "_" + timestamp + "." + extension

    s3.Object(BUCKET, filename).put(Body=image.read())

    return filename
import json
@bp.route('/explore',methods=['GET'])
def explore():
    if 'user' in g:
        user = User2.query.get(g.user)
    else:
        user = None
    start = request.args.get('num',0)
    count =request.args.get('count',5)
    print(start,count)
    tags = types.query.all()
    articles = Article.query.all()

    imglist = {}
    iconlist = {}
    for article in articles:
        icon_url = s3_client.generate_presigned_url('get_object',
                                                     Params={
                                                         'Bucket': BUCKET,
                                                         'Key':  article.user.icon,
                                                     },
                                                     ExpiresIn=3600)

        iconlist[article.id] =icon_url
        imglist[article.id] = []
        for image in article.images:
            filename = image.imgbase
            image_url = s3_client.generate_presigned_url('get_object',
                                                         Params={
                                                             'Bucket': BUCKET,
                                                             'Key': filename,
                                                         },
                                                         ExpiresIn=3600)
            imglist[article.id].append(image_url)
    # print(imglist)

    res = []
    newicons = {}
    newimages = {}
    for j in range(int(start),int(start+count)):
        if j < len(articles):
            obj ={}
            obj['title']=articles[j].title
            obj['type'] =articles[j].types.typename
            obj['id'] =articles[j].id
            obj['pdatetime'] =str(articles[j].pdatetime)
            obj['author'] =articles[j].user.username
            obj['lovenum'] = articles[j].love_num
            obj['icon'] = articles[j].user.icon
            obj['commentlength'] =len(articles[j].comments)
            res.append(obj)
            newicons[articles[j].id] = iconlist[articles[j].id]
            newimages[articles[j].id] = imglist[articles[j].id]
    if start==0:
        return render_template('article/explore.html',tags=tags,
                           articles = res,user = user,imglist = newimages,iconlist=newicons)
    return json.dumps({
        'data':res,
        'images':newimages,
        'icons':newicons,
        'user':user
    })

    # return render_template('article/explore.html', tags=tags,
    #                        articles=res, user=user, imglist=newimages, iconlist=newicons)


#选择用户ID查看他发表的内容
@bp.route('/show',methods=['GET'])
def show():
    id = request.args.get('id')
    user = User2.query.get(id)
    # articles = Article.query.all()
    return render_template('article/explore.html',articles = user.articles)

@bp.route('/details',methods=['GET'])
def details():
    if 'user' in g:
        user = User2.query.get(g.user)
    else:
        user = None
    pid = request.args.get('pid')
    article = Article.query.get(pid)
    users = User2.query.all()
    imglist=[]
    comments = Comment.query.all()
    for image in article.images:
        filename = image.imgbase
        image_url = s3_client.generate_presigned_url('get_object',
                                                     Params={
                                                         'Bucket': BUCKET,
                                                         'Key': filename,
                                                     },
                                                     ExpiresIn=3600)


        imglist.append(image_url)

    return render_template('article/detail.html',article = article,users=users,comments=comments,
                           imglist = imglist,user=user)

@bp.route('/addcomment',methods=['POST'])
def addcomment():
    content = request.form.get('content')
    author = request.form.get('author')
    pid = request.form.get(('pid'))
    comment = Comment()
    comment.content = content
    comment.user_id = author
    comment.article_id = pid
    db.session.add(comment)
    db.session.commit()
    return redirect('details?pid='+pid)

    # class Comment(db.Model):
    #     id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    #     content = db.Column(db.String(255), nullable=False)
    #     user_id = db.Column(db.Integer, db.ForeignKey('user2.id'), nullable=False)
    #     article_id = db.Column(db.Integer, db.ForeignKey('article.id'), nullable=False)
    #     cdatetime = db.Column(db.DateTime, default=datetime.datetime.now())