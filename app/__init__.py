from flask import Flask,g,render_template,jsonify,request,url_for
from app.user.view import bp
from app.article.view import bp
from app.resources.view import bp
from app.extends import db
from app.extends import bootstrap
webapp = Flask(__name__, instance_relative_config=True)
webapp.config['SQLALCHEMY_DATABASE_URI']='mysql+pymysql://root:abc980517@127.0.0.1:3306/covid19manage'
webapp.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
webapp.config['SECRET_KEY'] = 'super secret key'
webapp.secret_key = 'super secret key'
db.init_app(webapp)
bootstrap.init_app(webapp)
webapp.register_blueprint(user.view.bp)
webapp.register_blueprint(article.view.bp)
webapp.register_blueprint(resources.view.bp)
@webapp.route('/', methods=['GET'])
def index():

    # return 'Hello'
    return render_template('index.html')
@webapp.route('/testt', methods=['GET'])
def testt():

    # return 'Hello'
    return jsonify({
        'data':'1234'
    })
# @webapp.route('/register', methods=['GET'])
# def register():
#     # return 'Hello'
#     ret@webapp.route('/', methods=['GET'])
# def index():
#     # return 'Hello'
#     return render_template('index.html',name=['xiaobai','xiaohong'],obj={'a':1,'c':2})urn render_template('./auth/register.html')
@webapp.route('/test', methods=['GET'])
def test():
    # return 'Hello'
    return render_template('explore/explore.html')

@webapp.route('/explore', methods=['GET'])
def explore():
    # return 'Hello'
    return render_template('explore/explore.html')


