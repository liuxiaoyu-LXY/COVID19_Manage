
from app.extends import db
import datetime
class User2(db.Model):
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    username = db.Column(db.String(100),nullable=False)
    password = db.Column(db.String(64),nullable=False)
    phone = db.Column(db.String(11),unique=True)
    email = db.Column(db.String(20))
    icon = db.Column(db.String(100))
    rdatetime = db.Column(db.DateTime,default=datetime.datetime.now())
    isdelete = db.Column(db.Boolean,default = False)
    articles = db.relationship('Article',backref='user')


    def __str__(self):
        return self.username