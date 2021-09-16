from app.extends import db
import datetime
class Hospital(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(100), nullable=False)
    password = db.Column(db.String(64), default = '123456789')
    email = db.Column(db.String(20))
    address = db.Column(db.String(100),nullable=False)
    icon = db.Column(db.String(100))
    phone = db.Column(db.String(11))
    vaccine_has = db.relationship('Vaccines', backref='hospital')
    types = db.relationship('Vactype',secondary='vaccines',backref='hospitals')
    def __str__(self):
        return self.name

class Vaccines(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    adatetime = db.Column(db.DateTime, default=datetime.date.today())
    number = db.Column(db.Integer,nullable=False)
    hospital_id = db.Column(db.Integer, db.ForeignKey('hospital.id'), nullable=False)
    vtype = db.Column(db.Integer,db.ForeignKey('vactype.id'),nullable=False)


class Vactype(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    vaccines = db.relationship('Vaccines', backref='vactype')
