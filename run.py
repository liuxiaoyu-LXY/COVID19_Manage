# import logging
from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand
from app import webapp
from app.extends import db
from app.user.model import User2
from app.article.model import *
from app.resources.model import *
manager = Manager(app = webapp)
print (webapp.url_map)
migrate = Migrate(app=webapp,db=db)
manager.add_command('db',MigrateCommand)
@manager.command
def init():
    print('initial')
if __name__ == "__main__":
    manager.run()
    # webapp.run(debug=False)

