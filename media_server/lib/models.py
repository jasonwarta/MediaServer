from pymongo import TEXT
from pymongo.operations import IndexModel
from pymodm import connect, fields, MongoModel, EmbeddedMongoModel

connect('mongodb://localhost:27017/media-server')

class Movie(MongoModel):
    path = fields.CharField()
    file = fields.CharField(primary_key=True)
    name = fields.CharField()


class TV(MongoModel):
	path    = fields.CharField()
	file    = fields.CharField(primary_key=True)
	name    = fields.CharField()
	series  = fields.CharField()
	season  = fields.CharField()
	episode = fields.CharField()

class Book(MongoModel):
	path = fields.CharField()
	file = fields.CharField(primary_key=True)
	name = fields.CharField()

# class TV(MappedClass):
#     class __mongometa__:
#         session = session
#         name = 'tv'

#     _id = FieldProperty(schema.ObjectId)
#     path = FieldProperty(schema.String(required=True))
#     file = FieldProperty(schema.String(required=True))
#     name = FieldProperty(schema.String(required=True))
#     series = FieldProperty(schema.String(required=True))
#     season = FieldProperty(schema.String(required=True))
#     episode = FieldProperty(schema.String(required=True))


# Mapper.compile_all() 