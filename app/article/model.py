from app.extends import db
import datetime
class Article(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(50),nullable = False)
    content = db.Column(db.Text,nullable = False)
    pdatetime = db.Column(db.DateTime, default=datetime.datetime.now())
    love_num = db.Column(db.Integer,default = 0)
    user_id = db.Column(db.Integer,db.ForeignKey('user2.id'),nullable=False)
    type_id = db.Column(db.Integer, db.ForeignKey('types.id'), nullable=False)
     # img_id = db.Column(db.String(200),nullable=False)
    images = db.relationship('imgs',backref='relate_article')
    comments = db.relationship('Comment', backref='article')

class types(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    typename = db.Column(db.String(20),nullable=False)
    articles = db.relationship('Article', backref='types')

class imgs(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    imgcode = db.Column(db.String(10))
    imgbase = db.Column(db.Text, nullable=False)
    utame = db.Column(db.DateTime, default=datetime.datetime.now())
    article_id=db.Column(db.Integer, db.ForeignKey('article.id'), nullable=False)

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    content = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user2.id'), nullable=False)
    article_id = db.Column(db.Integer, db.ForeignKey('article.id'), nullable=False)
    cdatetime = db.Column(db.DateTime, default=datetime.datetime.now())
    author = db.relationship('User2', backref='comments')


    def __str__(self):
        return self.comment
