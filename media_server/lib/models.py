from pymongo import TEXT
from pymongo.operations import IndexModel
from pymodm import connect, MongoModel, EmbeddedMongoModel
from pymodm.fields import CharField, IntegerField, BigIntegerField, ObjectIdField, BinaryField, BooleanField, DateTimeField, Decimal128Field,EmailField, FileField, ImageField, FloatField,GenericIPAddressField, URLField, UUIDField,RegularExpressionField, JavaScriptField, TimestampField,DictField, OrderedDictField, ListField, PointField,LineStringField, PolygonField, MultiPointField,MultiLineStringField, MultiPolygonField, GeometryCollectionField,EmbeddedDocumentField, EmbeddedDocumentListField, ReferenceField

connect('mongodb://localhost:27017/media-server', connect=False)

class Genre(EmbeddedMongoModel):
	id = IntegerField(primary_key=True)
	name = CharField()

class Production_Company(EmbeddedMongoModel):
	id = IntegerField(primary_key=True)
	name = CharField()

class Production_Country(EmbeddedMongoModel):
	iso_3166_1 = CharField(primary_key=True)
	name = CharField()

class Spoken_Language(EmbeddedMongoModel):
	iso_639_1 = CharField(primary_key=True)
	name = CharField()

class Movie(MongoModel):
	path                 = CharField()
	file                 = CharField()
	name                 = CharField()
	file_id              = CharField(primary_key=True)
	# fields below this point are for TMDB movie queries against a movie id
	# GET 	/movie/{movie_id}
	# https://api.themoviedb.org/3/movie/{movie_id}?api_key=<<api_key>>&language=en-US
	adult                = BooleanField()
	backdrop_path        = CharField()
	budget               = IntegerField()
	genres               = EmbeddedDocumentListField('Genre')
	homepage             = URLField()
	id                   = IntegerField()
	imdb_id              = CharField()
	original_language    = CharField()
	original_title       = CharField()
	overview             = CharField()
	popularity           = IntegerField()
	poster_path          = CharField()
	production_companies = EmbeddedDocumentListField('Production_Company')
	production_countries = EmbeddedDocumentListField('Production_Country')
	release_date         = DateTimeField()
	revenue              = IntegerField()
	runtime              = IntegerField()
	spoken_languages     = EmbeddedDocumentListField('Spoken_Language')
	status               = CharField()
	tagline              = CharField()
	title                = CharField()
	video                = BooleanField()
	vote_average         = Decimal128Field()
	vote_count           = IntegerField()

class TV(MongoModel):
	path	= CharField()
	file_id = CharField(primary_key=True)
	file 	= CharField()
	name	= CharField()
	series  = CharField()
	season  = CharField()
	episode = CharField()

class Book(MongoModel):
	file_id = CharField(primary_key=True)
	path    = CharField()
	file    = CharField()
	name    = CharField()

# class TV(MappedClass):
#	 class __mongometa__:
#		 session = session
#		 name = 'tv'

#	 _id = FieldProperty(schema.ObjectId)
#	 path = FieldProperty(schema.String(required=True))
#	 file = FieldProperty(schema.String(required=True))
#	 name = FieldProperty(schema.String(required=True))
#	 series = FieldProperty(schema.String(required=True))
#	 season = FieldProperty(schema.String(required=True))
#	 episode = FieldProperty(schema.String(required=True))


# Mapper.compile_all() 