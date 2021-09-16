from flask import Blueprint,flash, jsonify, redirect, render_template,request, url_for, g
bp = Blueprint("user", __name__)
import re
import hashlib
import os
from sqlalchemy import or_,and_,not_
from app.user.model import User2
from app.extends import db
from app.utils import *
import time
from app.extends import avatars

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
    # request.headers['x-token'] = 'test_token'


@bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return render_template('./auth/register.html')

    try:
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        phone_number = request.form['phone_number']
        image = request.files.get('image')
        print('========',image)
        # profile_image = save_image(username, image)
        # print('========', profile_image)


        assert username is not None, "Please enter username"
        assert password is not None, "Please enter password"
        assert len(email)<=20,"email address is too long!"

        result_name = r'^[A-Za-z0-9._-]{2,100}$'
        result_password = r'^.{6,}$'

        assert re.match(result_name, username, re.M | re.I),"Username should have 2 to 100 characters, and only contains letter, number, underline and dash."


        userlist = User2.query.filter_by(username=username)
        res = []
        for u in userlist:
            if u.username == username:
                res.append(u)
        assert len(res)==0,"The username exists, please choose another!"
        assert re.match(result_password, password), "Password should have 6 to 18 characters"

        user = User2()
        user.username = username
        user.password = hashlib.sha256(password.encode('utf-8')).hexdigest()
        user.phone = phone_number
        user.email = email
        avatar_hash = hashlib.md5(username.lower().encode('utf-8')).hexdigest()
        avatar_hash = avatars.gravatar(avatar_hash)
        user.icon =avatar_hash
        # user.icon=profile_image
        db.session.add(user)
        db.session.commit()
        return jsonify({
            'isSuccess': True,
            'url': url_for('index'),
        })

    except (AssertionError) as e:
        return jsonify({
            'isSuccess': False,
            'message': e.args
        })

@bp.route('/manage', methods=['GET'])
@login_required
def manage():
    user = None
    # uid = None
    if 'user' in g:
        uid = g.user
        user = User2.query.get(int(uid))

    users = User2.query.filter(User2.isdelete == False).all()
    return render_template('./auth/manage.html',users = users,user=user)

@bp.route('/deluser', methods=['GET'])
@login_required
def deluser():
    userid= request.args.get('userid')
    user = User2.query.get(userid)
    # user.isdelete=True
    db.session.delete(user)
    db.session.commit()

    return redirect('/manage')
    # return render_template('./auth/manage.html',users = users)


@bp.route('/update', methods=['POST'])
@login_required
def update():
    id = request.form['userself']
    username = request.form['username']
    phone= request.form['phone']
    email= request.form['email']
    user = User2.query.get(id)
    user.email = email
    user.phone = phone
    if user.username!=username:
        userlist = User2.query.filter_by(username=username)
        res = []
        for u in userlist:
            res.append(u)
        if len(res)>0:
            return jsonify({
                'isSuccess': False,
                'message': 'Username exists!'
            })
        user.username = username
    db.session.commit()
    return jsonify({
        'isSuccess': True,
        'url': url_for('index'),
    })




@bp.route('/login', methods=['GET','POST'])
def login():
    if request.method == 'GET':
        return redirect(url_for('user.register'))

    try:

        username = request.form['username']
        password = request.form['password']

        uid = _authenticate(username, password)
        # update_login_table(username, 1)


        if uid:
            token = create_token(uid)
            response = jsonify({
                'isSuccess': True,
                'username': username,
                'z-token':token,
                'url': url_for('index')
            })

            # response.set_cookie('uid',str(uid),max_age=1800)
        return response
    except (AssertionError) as e:
        return jsonify({
            'isSuccess': False,
            'message': e.args
        })
def _authenticate(username,password):
    assert username is not None, "invalid username"
    assert password is not None, "invalid password"

    userlist = User2.query.filter_by(username=username)
    res = []
    for u in userlist:
        if u.username == username:
            res.append(u)
    assert len(res)>0,"No user, please sign up first!"
    assert res[0].password == hashlib.sha256(password.encode('utf-8')).hexdigest(),"Password is wrong!"
    if (len(res)>0):
        return res[0].id
    else:
        return None



@bp.route('/logout', methods=['GET'])
@login_required
def logout():
    response = redirect(url_for('user.manage'))
    response.delete_cookie('z-token')
    return response


def save_image(username, image):
    extension = image.filename.split('.')[-1]
    assert extension.lower() in set(
        ["bmp", "pbm", "pgm", "ppm", "sr", "ras", "jpeg", "jpg", "jpe", "jp2", "tiff", "tif", "png"]), \
        "Unsupported format "

    timestamp = str(int(time.time()))
    filename = username + "_" + timestamp + "." + extension

    s3.Object(BUCKET, filename).put(Body=image.read())

    return filename