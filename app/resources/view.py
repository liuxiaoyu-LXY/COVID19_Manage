from flask import Blueprint,flash, jsonify, redirect, render_template,request, url_for, g
bp = Blueprint("resources", __name__)
from app.extends import db
from app.user.model import User2
from app.resources.model import *
from app.utils import *

@bp.before_app_request
def before_request():
    token = request.cookies.get("z-token",None)
    # 拿到token，去换取用户信息
    user = verify_token(token)
    if user:
        g.user = user.id
    # request.headers['x-token'] = 'test_token'
import json
@bp.route('/nearby',methods=['GET','POST'])
def nearby():
    vactype = request.args.get('vacid',None)
    sortid = request.args.get('sortid', None)
    hospitals = Hospital.query.all()
    user = None
    # uid = None
    if 'user' in g:
        uid = g.user
        user = User2.query.get(int(uid))


    if vactype:
        res = []
        for hos in hospitals:
            for type in hos.types:
                # print(type.id,'sss')
                if int(type.id) == int(vactype):
                    res.append(hos)
                    break
        return render_template('./resources/resources.html', hospitals=res,user=user)


    return render_template('./resources/resources.html',hospitals=hospitals,user=user)

@bp.route('/addhospital',methods=['GET','POST'])
def addhospital():
    if request.method == 'GET':
        hospitals = Hospital.query.all()
        vactypes = Vactype.query.all()
        # for item in hos:
        #     if item.id > 5:
        #         db.session.delete(item)
        # db.session.commit()
        return render_template('./resources/resources2.html',vactypes=vactypes,hospitals=hospitals)
    name = request.form['name']
    username = request.form['username']
    email = request.form['email']
    phone= request.form['phone']
    address =request.form['address']
    hospital = Hospital()
    hospital.name=name
    hospital.username=username
    hospital.email=email
    hospital.phone=phone
    hospital.address = address
    db.session.add(hospital)
    db.session.commit()
    return 'ok'
@bp.route('/addvaccine',methods=['POST'])
def addvaccine():
    vac = Vaccines()
    vac.number = request.form['number']
    vac.adatetime = request.form['adatetime']
    vac.hospital_id = request.form['hospital_id']
    vac.vtype = request.form['vtype']
    vac.number = request.form['number']
    db.session.add(vac)
    db.session.commit()
    return 'addok'


@bp.route('/hosinfo',methods=['GET'])
def hosinfo():
    hos = Hospital.query.all()
    res= []
    for hositem in hos:

        obj = {}
        obj['name'] = hositem.name
        obj['id']= hositem.id
        obj['address'] = hositem.address
        res.append(obj)

    return jsonify({
        'isSuccess': True,
        'data':res,
        'message': 'oo'
    })
@bp.route('/addvactype',methods=['POST'])
def addvactype():
    arr = ['AstraZeneca','Morderna','Pfizer']
    for item in arr:
        vactype = Vactype()
        vactype.name = item
        db.session.add(vactype)
    db.session.commit()
    return '09ok'

@bp.route('/hospital',methods=['GET','POST'])
@login_required
def hospital():
    user = None
    # uid = None
    if 'user' in g:
        uid = g.user
        user = User2.query.get(int(uid))
    hid = request.args.get('id',None)
    hospital = Hospital.query.get(hid)
    return render_template('./resources/hospital.html',hospital=hospital,user=user)