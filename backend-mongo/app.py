from flask import Flask, request, jsonify
from flask_marshmallow import Marshmallow
from flask_cors import CORS
from flask_bcrypt import check_password_hash, generate_password_hash
import jwt
import datetime
from mongoengine import Document, StringField, connect


app = Flask(__name__)

# For using frontend
CORS(app)

# Configure MongoDB connection
# Replace 'flaskmongodb' with your database name, and 'localhost' with your MongoDB server address.
connect('flaskmongodb', host='mongodb://localhost:27017')

ma = Marshmallow(app)

class User(Document):
    email = StringField(max_length=100, unique=True)
    user = StringField(max_length=200, unique=True)
    password = StringField(max_length=200)

class Allnode(Document):
    user = StringField(max_length=200)
    code = StringField(max_length=100, unique=True)
    name = StringField(max_length=200)

# ... (rest of the code remains the same)
# Define la función para crear el esquema dinámicamente
def create_table_schema(code):
    class TableSchema(ma.Schema):
        class Meta:
            fields = ('id', 'temperature', 'humidity')

    table_schema = TableSchema()
    tables_schema = TableSchema(many=True)

    globals()[f'table_{code}_schema'] = table_schema
    globals()[f'tables_{code}_schema'] = tables_schema


#----------------------------

class UserSchema(ma.Schema):
    class Meta:
        fields = ('email', 'user', 'password')


user_schema = UserSchema()
users_schema = UserSchema(many=True)

#Allnode
class AllnodeSchema(ma.Schema):
    class Meta:
        fields = ('user', 'code', 'name')


allnode_schema = AllnodeSchema()
allnodes_schema = AllnodeSchema(many=True)


@app.route('/loginup', methods=['POST'])
def create_user():
    email = request.json['email']
    user = request.json['user']
    password = generate_password_hash(request.json['password'])
    existing_user = User.objects(user=user).first()
    if existing_user:
        return jsonify({'error': 'User already exists'}), 409
    new_user = User(email=email, user=user, password=password)
    new_user.save()
    return user_schema.jsonify(new_user)


@app.route('/loginup', methods=['GET'])
def get_users():
    all_users = User.objects.all()
    result = users_schema.dump(all_users)
    return jsonify(result)



@app.route('/loginup/<id>', methods=['GET'])
def get_user(id):
    user = User.objects(id=id).first()  # Use 'objects' instead of 'query'
    return user_schema.jsonify(user)


@app.route('/loginup/<id>', methods=['PUT'])
def update_user(id):
    user = User.objects(id=id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    email = request.json['email']
    user.user = request.json['user']
    password = request.json['password']

    user.email = email
    user.password = generate_password_hash(password).decode('utf-8')

    user.save()

    return user_schema.jsonify(user)


@app.route('/loginup/<id>', methods=['DELETE'])
def delete_user(id):
    user_to_delete = User.objects(id=id).first()  # Use 'objects' instead of 'query'
    user_to_delete.delete()  # Delete the document from the database

    return user_schema.jsonify(user_to_delete)



#Login IN (Iniciar sesion)
@app.route('/', methods=['POST'])
def login():
    data = request.get_json()
    username = data['user']
    password = data['password']

    user = User.objects(user=username).first()
    if user and check_password_hash(user.password, password):
        # Las credenciales son válidas, puedes generar un token de autenticación aquí
        token = generate_token(user)  # Ejemplo: función para generar el token

        return jsonify({'token': token, "user_id": str(user.id)}), 200

    # Las credenciales son incorrectas
    return jsonify({'error': 'Credenciales inválidas'}), 401


def generate_token(user):
    # Definir las opciones y configuraciones del token
    token_payload = {
        'user_id': str(user.id),
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expira en 1 hora
    }
    secret_key = 'tuclavesecretadeltoken'  # Cambia esto a tu clave secreta real

    # Generar el token JWT utilizando PyJWT
    token = jwt.encode(token_payload, secret_key, algorithm='HS256')
    return token



#Allnode
@app.route('/allnode', methods=['POST'])
def create_allnode():
    user = request.json['user']
    code = request.json['code']
    name = request.json['name']
    
    code_same = Allnode.objects(code=code).first()
    if code_same:
        return jsonify({'error': 'code already exists'}), 409
    
    new_allnode = Allnode(user=user, code=code, name=name)
    new_allnode.save()

    return allnode_schema.jsonify(new_allnode)

@app.route('/allnode/<user>', methods=['GET'])
def get_allnode_user(user):
    allnodes = Allnode.objects(user=user).all()

    data = []
    for allnode in allnodes:
        data.append({
            'id': str(allnode.id),
            'user': allnode.user,
            'code': allnode.code,
            'name': allnode.name
        })

    return jsonify(data)

@app.route('/allnode/<id>', methods=['PUT'])
def put_allnode_user(id):
    allnode_to_update = Allnode.objects(id=id).first()

    name = request.json['name']
    allnode_to_update.name = name
    allnode_to_update.save()

    return allnode_schema.jsonify(allnode_to_update)

@app.route('/allnode/<id>', methods=['DELETE'])
def delete_node_allnode(id):
    allnode_to_delete = Allnode.objects(id=id).first()
    allnode_to_delete.delete()

    return allnode_schema.jsonify(allnode_to_delete)

#delete account 
@app.route('/allnodeaccount/<user>', methods=['DELETE'])
def delete_node_allnode_account(user):
    allnodes = Allnode.objects(user=user).all()

    for allnode in allnodes:
        allnode.delete()

    return 'deleted successfully'

@app.route('/allnode/<id>/<user>', methods=['GET'])
def get_allnode_row(id, user):
    task = Allnode.objects(id=id, user=user).all()
    return allnodes_schema.jsonify(task)

#Table Code
@app.route('/tablecode', methods=['POST'])
def create_tablecode():
    try:
        code = request.json.get('code')
        if not code:
            return 'Code not provided', 400

        table_name = f'table_{code}'

        create_table_schema(code)

        return 'Code table created successfully', 201

    except Exception as e:
        return str(e), 500

@app.route('/tablecode/<code>', methods=['POST'])
def post_tablecode(code):
    try:
        temperature = request.json.get('temperature')
        humidity = request.json.get('humidity')

        # Creamos un objeto User que representa la colección con nombre 'table_code'
        TableClass = type(f'table_{code}', (Document,), {
            'temperature': StringField(max_length=200),
            'humidity': StringField(max_length=100)
        })
        
        table_entry = TableClass(temperature=temperature, humidity=humidity)
        table_entry.save()

        return 'Data added successfully', 201

    except Exception as e:
        return str(e), 500

#-----------------------------------------------------------------------------------------

# Table Code
@app.route('/tablecode/<code>', methods=['DELETE'])
def delete_tablecode(code):
    try:
        table_name = f'table_{code}'
        # Verificamos si la colección existe realmente en la base de datos
        if table_name not in User._get_db().list_collection_names():
            return 'Table not found', 404

        # Eliminamos la colección completa
        User._get_db().drop_collection(table_name)

        return 'Table deleted successfully', 200

    except Exception as e:
        return str(e), 500

@app.route('/tablecode/<code>', methods=['GET'])
def get_tablecode(code):
    try:
        table_name = f'table_{code}'
        # Verificamos si la colección existe realmente en la base de datos
        if table_name not in User._get_db().list_collection_names():
            return 'Table not found', 404

        # Obtenemos los datos de la colección específica
        TableClass = type(table_name, (Document,), {
            'temperature': StringField(max_length=200),
            'humidity': StringField(max_length=100)
        })
        table_data = TableClass.objects().all()

        data = []
        for row in table_data:
            data.append({
                'id': str(row.id),
                'temperature': row.temperature,
                'humidity': row.humidity
            })

        return jsonify(data), 200

    except Exception as e:
        return str(e), 500

# Delete tables in delete account
@app.route('/tablecodeall/<user>', methods=['DELETE'])
def delete_user_tablecodes(user):
    try:
        allnodes = Allnode.objects(user=user).all()

        for allnode in allnodes:
            table_name = f'table_{allnode.code}'
            if table_name in User._get_db().list_collection_names():
                # Eliminamos la colección completa
                User._get_db().drop_collection(table_name)

        return 'Tables data deleted successfully', 200

    except Exception as e:
        return str(e), 500
    
   

if __name__ == '__main__':
    app.run(debug=True)

#docker run --name mymongo -p 27017:27017 -d mongo:latest
#docker exec -it mymongo bash
#mongosh
#use flaskmongodb;
#show collections;
#db.user.find().pretty();