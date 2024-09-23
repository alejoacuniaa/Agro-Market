const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // Asegúrate de que el cuerpo de las solicitudes se pueda analizar como JSON

// Crear una conexión a la base de datos MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  port: '3306',
  password: 'alejo1808',
  database: 'AgroMarket'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos: ', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

// Ruta para verificar la conexión
app.get('/', (req, res) => {
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.send(`La solución es: ${results[0].solution}`);
  });
});

// Ruta para obtener todos los ítems (GET /items)
//http://localhost:3000/Usuarios
app.get('/Usuarios', (req, res) => {
  connection.query('SELECT * FROM Usuarios', (err, results) => {
    if (err) {
      console.error('Error al obtener los ítems: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.json(results); // Enviar los resultados como respuesta en formato JSON
  });
});

// Ruta para agregar un ítem (POST /items)
app.post('/Usuarios', (req, res) => {
  const newItem = req.body;
  const query = 'INSERT INTO Usuarios (Nombre, Correo_Electronico, Telefono, Contraseña, Tipo_Usuario) VALUES (?, ?, ?, ?, ?)';
  connection.query(query, [newItem.Nombre, newItem.Correo_Electronico, newItem.Telefono, newItem.Contraseña, newItem.Tipo_Usuario], (err, result) => {
    if (err) {
      console.error('Error al agregar un ítem: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.status(201).json({ id: result.insertId, ...newItem });
  });
});

// Leer todos los usuarios
app.get('/Usuarios', (req, res) => {
  connection.query('SELECT * FROM Usuarios', (err, results) => {
    if (err) {
      console.error('Error al obtener los usuarios: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.json(results);
  });
});

// Leer un usuario por ID
app.get('/Usuarios/:id', (req, res) => {
  const userId = req.params.id;
  connection.query('SELECT * FROM Usuarios WHERE ID_Usuario = ?', [userId], (err, results) => {
    if (err) {
      console.error('Error al obtener el usuario: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    if (results.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.json(results[0]);
  });
});

// Actualizar un usuario
app.put('/Usuarios/:id', (req, res) => {
  const userId = req.params.id;
  const updatedItem = req.body;
  const query = 'UPDATE Usuarios SET Nombre = ?, Correo_Electronico = ?, Telefono = ?, Contraseña = ?, Tipo_Usuario = ? WHERE ID_Usuario = ?';
  connection.query(query, [updatedItem.Nombre, updatedItem.Correo_Electronico, updatedItem.Telefono, updatedItem.Contraseña, updatedItem.Tipo_Usuario, userId], (err, result) => {
    if (err) {
      console.error('Error al actualizar el usuario: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.json({ message: 'Usuario actualizado' });
  });
});

// Eliminar un usuario
app.delete('/Usuarios/:id', (req, res) => {
  const userId = req.params.id;
  connection.query('DELETE FROM Usuarios WHERE ID_Usuario = ?', [userId], (err, result) => {
    if (err) {
      console.error('Error al eliminar el usuario: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    if (result.affectedRows === 0) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.json({ message: 'Usuario eliminado' });
  });
});

// Obtener todos los productos (GET /productos)
app.get('/Producto', (req, res) => {
  connection.query('SELECT * FROM Producto', (err, results) => {
    if (err) {
      console.error('Error al obtener los productos: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.json(results);
  });
});

// Agregar un nuevo producto (POST /productos)
app.post('/Producto', (req, res) => {
  const newProduct = req.body;
  const query = 'INSERT INTO Producto (Nombre_Producto, Descripcion, Categoria, Precio, Cantidad_Disponible, Ubicacion, ID_Vendedor) VALUES (?, ?, ?, ?, ?, ?, ?)';
  connection.query(query, [newProduct.Nombre_Producto, newProduct.Descripcion, newProduct.Categoria, newProduct.Precio, newProduct.Cantidad_Disponible, newProduct.Ubicacion, newProduct.ID_Vendedor], (err, result) => {
    if (err) {
      console.error('Error al agregar el producto: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.status(201).json({ id: result.insertId, ...newProduct });
  });
});

// Actualizar un producto (PUT /productos/:id)
app.put('/Productoo/:id', (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;
  const query = 'UPDATE Producto SET Nombre_Producto = ?, Descripcion = ?, Categoria = ?, Precio = ?, Cantidad_Disponible = ?, Ubicacion = ?, ID_Vendedor = ? WHERE ID_Producto = ?';
  connection.query(query, [updatedProduct.Nombre_Producto, updatedProduct.Descripcion, updatedProduct.Categoria, updatedProduct.Precio, updatedProduct.Cantidad_Disponible, updatedProduct.Ubicacion, updatedProduct.ID_Vendedor, productId], (err, result) => {
    if (err) {
      console.error('Error al actualizar el producto: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.json({ message: 'Producto actualizado' });
  });
});

// Eliminar un producto (DELETE /productos/:id)
app.delete('/Producto/:id', (req, res) => {
  const productId = req.params.id;
  connection.query('DELETE FROM Producto WHERE ID_Producto = ?', [productId], (err, result) => {
    if (err) {
      console.error('Error al eliminar el producto: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.json({ message: 'Producto eliminado' });
  });
});

// Obtener todas las transacciones de productos (GET /transaccion-productos)
app.get('/Transaccion-Producto', (req, res) => {
  connection.query('SELECT * FROM Transaccion_Producto', (err, results) => {
    if (err) {
      console.error('Error al obtener las transacciones de productos: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.json(results);
  });
});

// Agregar una transacción de producto (POST /transaccion-productos)
app.post('/Transaccion-Producto', (req, res) => {
  const newTransaction = req.body;
  const query = 'INSERT INTO Transaccion_Producto (ID_Transaccion, ID_Producto, Cantidad, Precio_Unitario) VALUES (?, ?, ?, ?)';
  connection.query(query, [newTransaction.ID_Transaccion, newTransaction.ID_Producto, newTransaction.Cantidad, newTransaction.Precio_Unitario], (err, result) => {
    if (err) {
      console.error('Error al agregar la transacción de producto: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.status(201).json({ message: 'Transacción de producto añadida' });
  });
});

// Obtener todos los mensajes (GET /mensajes)
app.get('/Mensaje', (req, res) => {
  connection.query('SELECT * FROM Mensaje', (err, results) => {
    if (err) {
      console.error('Error al obtener los mensajes: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.json(results);
  });
});

// Agregar un mensaje (POST /mensajes)
app.post('/Mensaje', (req, res) => {
  const newMessage = req.body;
  const query = 'INSERT INTO Mensaje (ID_Producto, ID_Emisor, ID_Receptor, Contenido_Mensaje) VALUES (?, ?, ?, ?)';
  connection.query(query, [newMessage.ID_Producto, newMessage.ID_Emisor, newMessage.ID_Receptor, newMessage.Contenido_Mensaje], (err, result) => {
    if (err) {
      console.error('Error al agregar el mensaje: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.status(201).json({ message: 'Mensaje añadido' });
  });
});

// Obtener todas las notificaciones (GET /notificaciones)
app.get('/Motificacion', (req, res) => {
  connection.query('SELECT * FROM Notificacion', (err, results) => {
    if (err) {
      console.error('Error al obtener las notificaciones: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.json(results);
  });
});

// Obtener todos los favoritos (GET /favoritos)
app.get('/Favorito', (req, res) => {
  connection.query('SELECT * FROM Favorito', (err, results) => {
    if (err) {
      console.error('Error al obtener los favoritos: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.json(results);
  });
});

// Agregar un favorito (POST /favoritos)
app.post('/Favorito', (req, res) => {
  const newFavorito = req.body;
  const query = 'INSERT INTO Favorito (ID_Usuario, ID_Producto) VALUES (?, ?)';
  connection.query(query, [newFavorito.ID_Usuario, newFavorito.ID_Producto], (err, result) => {
    if (err) {
      console.error('Error al agregar el favorito: ', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.status(201).json({ message: 'Favorito añadido' });
  });
});


// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});