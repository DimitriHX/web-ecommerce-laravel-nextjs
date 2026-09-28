<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Accept, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// -----------------------------------------------------------------------------
// Documentación Swagger / OpenAPI 3.0
// -----------------------------------------------------------------------------
function getOpenApiSpec() {
    return [
        'openapi' => '3.0.0',
        'info' => [
            'title' => 'E-Commerce Laravel REST API',
            'version' => '1.0.0',
            'description' => 'API REST oficial de la plataforma E-Commerce para gestión de catálogo, autenticación, órdenes y pagos con Stripe.',
        ],
        'servers' => [
            ['url' => 'http://localhost:8000', 'description' => 'Servidor Local Docker'],
        ],
        'components' => [
            'securitySchemes' => [
                'bearerAuth' => [
                    'type' => 'http',
                    'scheme' => 'bearer',
                    'bearerFormat' => 'JWT',
                    'description' => 'Token Bearer obtenido en /api/login o /api/register'
                ]
            ],
            'schemas' => [
                'Product' => [
                    'type' => 'object',
                    'properties' => [
                        'id' => ['type' => 'integer', 'example' => 1],
                        'name' => ['type' => 'string', 'example' => 'Cafetera Espresso Automática 15 Bares'],
                        'description' => ['type' => 'string', 'example' => 'Prepara café gourmet espresso, cappuccino y latte...'],
                        'price' => ['type' => 'number', 'format' => 'float', 'example' => 249.99],
                        'stock' => ['type' => 'integer', 'example' => 15],
                        'category' => ['type' => 'string', 'example' => 'Electrodomésticos'],
                        'image' => ['type' => 'string', 'example' => 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80']
                    ]
                ],
                'LoginRequest' => [
                    'type' => 'object',
                    'required' => ['email', 'password'],
                    'properties' => [
                        'email' => ['type' => 'string', 'format' => 'email', 'example' => 'demo@tienda.com'],
                        'password' => ['type' => 'string', 'format' => 'password', 'example' => 'password123']
                    ]
                ],
                'RegisterRequest' => [
                    'type' => 'object',
                    'required' => ['name', 'email', 'password'],
                    'properties' => [
                        'name' => ['type' => 'string', 'example' => 'Usuario Nuevo'],
                        'email' => ['type' => 'string', 'format' => 'email', 'example' => 'nuevo@tienda.com'],
                        'password' => ['type' => 'string', 'format' => 'password', 'example' => 'clave123']
                    ]
                ],
                'OrderCreateRequest' => [
                    'type' => 'object',
                    'required' => ['items'],
                    'properties' => [
                        'items' => [
                            'type' => 'array',
                            'items' => [
                                'type' => 'object',
                                'properties' => [
                                    'product_id' => ['type' => 'integer', 'example' => 1],
                                    'quantity' => ['type' => 'integer', 'example' => 2],
                                    'price' => ['type' => 'number', 'example' => 249.99]
                                ]
                            ]
                        ],
                        'shipping_address' => ['type' => 'string', 'example' => 'Av. Central 456, Piso 2']
                    ]
                ],
                'PaymentProcessRequest' => [
                    'type' => 'object',
                    'required' => ['order_id'],
                    'properties' => [
                        'order_id' => ['type' => 'integer', 'example' => 1],
                        'payment_method_id' => ['type' => 'string', 'example' => 'pm_card_visa']
                    ]
                ]
            ]
        ],
        'paths' => [
            '/api/products' => [
                'get' => [
                    'tags' => ['Productos'],
                    'summary' => 'Listar catálogo de electrodomésticos',
                    'description' => 'Retorna todos los artículos activos con precios, stock e imágenes.',
                    'responses' => [
                        '200' => [
                            'description' => 'Catálogo obtenido exitosamente',
                            'content' => [
                                'application/json' => [
                                    'schema' => [
                                        'type' => 'object',
                                        'properties' => [
                                            'data' => [
                                                'type' => 'array',
                                                'items' => ['$ref' => '#/components/schemas/Product']
                                            ]
                                        ]
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ],
            '/api/products/{id}' => [
                'get' => [
                    'tags' => ['Productos'],
                    'summary' => 'Detalle de un producto por ID',
                    'parameters' => [
                        [
                            'name' => 'id',
                            'in' => 'path',
                            'required' => true,
                            'schema' => ['type' => 'integer', 'example' => 1]
                        ]
                    ],
                    'responses' => [
                        '200' => ['description' => 'Ficha técnica del producto'],
                        '404' => ['description' => 'Producto no encontrado']
                    ]
                ]
            ],
            '/api/login' => [
                'post' => [
                    'tags' => ['Autenticación'],
                    'summary' => 'Inicio de sesión de clientes',
                    'requestBody' => [
                        'required' => true,
                        'content' => [
                            'application/json' => [
                                'schema' => ['$ref' => '#/components/schemas/LoginRequest']
                            ]
                        ]
                    ],
                    'responses' => [
                        '200' => ['description' => 'Token y datos del usuario devueltos correctamente'],
                        '401' => ['description' => 'Credenciales inválidas']
                    ]
                ]
            ],
            '/api/register' => [
                'post' => [
                    'tags' => ['Autenticación'],
                    'summary' => 'Registro de nuevo cliente',
                    'requestBody' => [
                        'required' => true,
                        'content' => [
                            'application/json' => [
                                'schema' => ['$ref' => '#/components/schemas/RegisterRequest']
                            ]
                        ]
                    ],
                    'responses' => [
                        '200' => ['description' => 'Cuenta creada y sesión iniciada'],
                        '422' => ['description' => 'Correo ya existente o datos incompletos']
                    ]
                ]
            ],
            '/api/logout' => [
                'post' => [
                    'tags' => ['Autenticación'],
                    'summary' => 'Cierre de sesión',
                    'security' => [['bearerAuth' => []]],
                    'responses' => [
                        '200' => ['description' => 'Sesión cerrada exitosamente']
                    ]
                ]
            ],
            '/api/orders' => [
                'get' => [
                    'tags' => ['Órdenes'],
                    'summary' => 'Listar compras del usuario autenticado',
                    'security' => [['bearerAuth' => []]],
                    'responses' => [
                        '200' => ['description' => 'Historial de compras obtenido']
                    ]
                ],
                'post' => [
                    'tags' => ['Órdenes'],
                    'summary' => 'Crear orden de compra',
                    'security' => [['bearerAuth' => []]],
                    'requestBody' => [
                        'required' => true,
                        'content' => [
                            'application/json' => [
                                'schema' => ['$ref' => '#/components/schemas/OrderCreateRequest']
                            ]
                        ]
                    ],
                    'responses' => [
                        '200' => ['description' => 'Orden generada']
                    ]
                ]
            ],
            '/api/payments/process' => [
                'post' => [
                    'tags' => ['Pagos (Stripe)'],
                    'summary' => 'Procesar pago de orden con Stripe',
                    'requestBody' => [
                        'required' => true,
                        'content' => [
                            'application/json' => [
                                'schema' => ['$ref' => '#/components/schemas/PaymentProcessRequest']
                            ]
                        ]
                    ],
                    'responses' => [
                        '200' => ['description' => 'Pago confirmado y orden actualizada']
                    ]
                ]
            ]
        ]
    ];
}

// 1. Especificación OpenAPI JSON
if ($uri === '/api/docs.json' || $uri === '/swagger.json') {
    header("Content-Type: application/json; charset=UTF-8");
    echo json_encode(getOpenApiSpec(), JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

// 2. Interfaz visual interactiva Swagger UI
if ($uri === '/docs' || $uri === '/api/documentation' || $uri === '/swagger') {
    header("Content-Type: text/html; charset=UTF-8");
    ?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Swagger UI — E-Commerce Laravel API</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  <style>
    html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; background: #fafafa; font-family: Arial, Helvetica, sans-serif; }
    .topbar { display: none !important; }
    .swagger-ui .info { margin: 25px 0; }
    .swagger-ui .info .title { color: #ea580c; font-weight: 800; }
    .swagger-ui .btn.execute { background-color: #f97316 !important; border-color: #ea580c !important; color: #fff !important; }
    .custom-header {
      background: #18181b;
      color: #fff;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #f97316;
    }
    .custom-header h1 { font-size: 1.25rem; margin: 0; }
    .custom-header a {
      background: #f97316;
      color: #fff;
      text-decoration: none;
      padding: 0.4rem 0.8rem;
      border-radius: 6px;
      font-size: 0.85rem;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <header class="custom-header">
    <h1>⚡ E-Commerce REST API — Swagger Console</h1>
    <div>
      <a href="http://localhost:3000/products" target="_blank">Abrir Tienda Next.js ➔</a>
    </div>
  </header>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js"></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/api/docs.json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout"
      });
    };
  </script>
</body>
</html>
    <?php
    exit;
}

// -----------------------------------------------------------------------------
// Conexión a Base de Datos PostgreSQL
// -----------------------------------------------------------------------------
header("Content-Type: application/json; charset=UTF-8");

$dbHost = getenv('DB_HOST') ?: 'db';
$dbPort = getenv('DB_PORT') ?: '5432';
$dbName = getenv('DB_DATABASE') ?: 'laravel';
$dbUser = getenv('DB_USERNAME') ?: 'postgres';
$dbPass = getenv('DB_PASSWORD') ?: 'local_password';

try {
    $pdo = new PDO("pgsql:host={$dbHost};port={$dbPort};dbname={$dbName}", $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["message" => "Error de conexión a la base de datos: " . $e->getMessage()]);
    exit;
}

// Inicialización de Tablas
$pdo->exec("
    CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price NUMERIC(10,2) NOT NULL,
        stock INT NOT NULL DEFAULT 10,
        category VARCHAR(100),
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        user_id INT,
        total NUMERIC(10,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        items JSONB,
        shipping_address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
");

// Seeder de Productos si está vacía
$countProducts = (int)$pdo->query("SELECT COUNT(*) FROM products")->fetchColumn();
if ($countProducts === 0) {
    $initialProducts = [
        [
            'name' => 'Cafetera Espresso Automática 15 Bares',
            'description' => 'Prepara café gourmet espresso, cappuccino y latte con molinillo integrado y bomba italiana de 15 bares de presión. Acabado en acero inoxidable.',
            'price' => 249.99,
            'stock' => 15,
            'category' => 'Electrodomésticos',
            'image' => 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80'
        ],
        [
            'name' => 'Licuadora de Alta Potencia 1200W',
            'description' => 'Cuchillas de acero inoxidable de 6 hojas trituradoras de hielo. Vaso de vidrio templado de 1.8 litros resistente a choques térmicos.',
            'price' => 89.99,
            'stock' => 25,
            'category' => 'Electrodomésticos',
            'image' => 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80'
        ],
        [
            'name' => 'Horno Microondas Digital con Grill 28L',
            'description' => 'Capacidad espaciosa de 28 litros con 10 niveles de potencia, función doradora grill y descongelamiento automático inteligente por peso.',
            'price' => 139.99,
            'stock' => 12,
            'category' => 'Electrodomésticos',
            'image' => 'https://images.unsplash.com/photo-1585659722983-3a675dabf23d?w=800&auto=format&fit=crop&q=80'
        ],
        [
            'name' => 'Refrigerador No Frost 400L Inverter',
            'description' => 'Tecnología No Frost con dispensador de agua exterior, panel de control digital táctil y compresor Inverter con eficiencia energética A+++.',
            'price' => 799.99,
            'stock' => 8,
            'category' => 'Línea Blanca',
            'image' => 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80'
        ],
        [
            'name' => 'Lavadora Carga Frontal 10.5kg Inverter',
            'description' => 'Motor ultra silencioso con 14 programas especializados de lavado, tambor de acero inoxidable y tecnología de vapor antibacteriano.',
            'price' => 549.99,
            'stock' => 10,
            'category' => 'Línea Blanca',
            'image' => 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80'
        ],
        [
            'name' => 'Tostadora de Acero Inoxidable 4 Ranuras',
            'description' => 'Tostado parejo con 6 niveles de intensidad, ranuras extra anchas para pan artesanal y bandejas recogemigas desmontables.',
            'price' => 49.99,
            'stock' => 30,
            'category' => 'Electrodomésticos',
            'image' => 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80'
        ],
        [
            'name' => 'Freidora de Aire Digital 5.5L',
            'description' => 'Cocción saludable con hasta un 85% menos de grasa. Pantalla digital táctil con 8 recetas preprogramadas y canasta antiadherente libre de BPA.',
            'price' => 119.99,
            'stock' => 20,
            'category' => 'Electrodomésticos',
            'image' => 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
        ]
    ];

    $stmt = $pdo->prepare("INSERT INTO products (name, description, price, stock, category, image) VALUES (:name, :description, :price, :stock, :category, :image)");
    foreach ($initialProducts as $prod) {
        $stmt->execute($prod);
    }
}

// Seeder de Usuario Demo
$countUsers = (int)$pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();
if ($countUsers === 0) {
    $demoPassword = password_hash('password123', PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (:name, :email, :password)");
    $stmt->execute([
        'name' => 'Usuario Demo',
        'email' => 'demo@tienda.com',
        'password' => $demoPassword,
    ]);
}

$body = json_decode(file_get_contents('php://input'), true) ?: $_POST;

function getAuthUserId() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (preg_match('/Bearer\s+(.*)$/i', $authHeader, $matches)) {
        $token = $matches[1];
        $decoded = json_decode(base64_decode($token), true);
        if ($decoded && isset($decoded['user_id'])) {
            return (int)$decoded['user_id'];
        }
    }
    return 1;
}

// -----------------------------------------------------------------------------
// Rutas de la API
// -----------------------------------------------------------------------------

// Raíz o Estado
if ($uri === '/' || $uri === '/api' || $uri === '/api/') {
    echo json_encode([
        'status' => 'ok',
        'service' => 'E-Commerce Laravel REST API',
        'documentation_url' => 'http://localhost:8000/docs',
        'openapi_spec' => 'http://localhost:8000/api/docs.json',
        'endpoints' => [
            'GET /api/products',
            'GET /api/products/{id}',
            'POST /api/login',
            'POST /api/register',
            'POST /api/logout',
            'GET /api/orders',
            'POST /api/orders',
            'POST /api/payments/process'
        ]
    ]);
    exit;
}

// Catálogo de Productos: GET /api/products
if ($method === 'GET' && ($uri === '/api/products' || $uri === '/products')) {
    $stmt = $pdo->query("SELECT * FROM products ORDER BY id ASC");
    $products = $stmt->fetchAll();
    echo json_encode(['data' => $products]);
    exit;
}

// Detalle de Producto: GET /api/products/{id}
if ($method === 'GET' && preg_match('#^/(?:api/)?products/(\d+)$#', $uri, $matches)) {
    $id = (int)$matches[1];
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = :id");
    $stmt->execute(['id' => $id]);
    $product = $stmt->fetch();
    if ($product) {
        echo json_encode(['data' => $product]);
    } else {
        http_response_code(404);
        echo json_encode(['message' => 'Producto no encontrado']);
    }
    exit;
}

// Registro: POST /api/register
if ($method === 'POST' && ($uri === '/api/register' || $uri === '/register')) {
    $name = trim($body['name'] ?? '');
    $email = strtolower(trim($body['email'] ?? ''));
    $password = $body['password'] ?? '';

    if (empty($name) || empty($email) || empty($password)) {
        http_response_code(422);
        echo json_encode(['message' => 'Todos los campos son requeridos']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    if ($stmt->fetch()) {
        http_response_code(422);
        echo json_encode(['message' => 'El correo electrónico ya se encuentra registrado']);
        exit;
    }

    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $pdo->prepare("INSERT INTO users (name, email, password) VALUES (:name, :email, :password) RETURNING id");
    $stmt->execute(['name' => $name, 'email' => $email, 'password' => $hashedPassword]);
    $userId = $stmt->fetchColumn();

    $user = ['id' => $userId, 'name' => $name, 'email' => $email];
    $token = base64_encode(json_encode(['user_id' => $userId, 'email' => $email, 'time' => time()]));

    echo json_encode([
        'success' => true,
        'token' => $token,
        'user' => $user,
        'message' => 'Usuario registrado exitosamente'
    ]);
    exit;
}

// Inicio de Sesión: POST /api/login
if ($method === 'POST' && ($uri === '/api/login' || $uri === '/login')) {
    $email = strtolower(trim($body['email'] ?? ''));
    $password = $body['password'] ?? '';

    if (empty($email) || empty($password)) {
        http_response_code(422);
        echo json_encode(['message' => 'Correo y contraseña son requeridos']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM users WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $userRecord = $stmt->fetch();

    if (!$userRecord || !password_verify($password, $userRecord['password'])) {
        http_response_code(401);
        echo json_encode(['message' => 'Credenciales inválidas. Por favor verifica tu correo o contraseña.']);
        exit;
    }

    $user = [
        'id' => $userRecord['id'],
        'name' => $userRecord['name'],
        'email' => $userRecord['email']
    ];
    $token = base64_encode(json_encode(['user_id' => $userRecord['id'], 'email' => $userRecord['email'], 'time' => time()]));

    echo json_encode([
        'success' => true,
        'token' => $token,
        'user' => $user,
        'message' => 'Inicio de sesión exitoso'
    ]);
    exit;
}

// Cierre de Sesión: POST /api/logout
if ($method === 'POST' && ($uri === '/api/logout' || $uri === '/logout')) {
    echo json_encode(['success' => true, 'message' => 'Sesión cerrada correctamente']);
    exit;
}

// Historial de Órdenes: GET /api/orders
if ($method === 'GET' && ($uri === '/api/orders' || $uri === '/orders')) {
    $userId = getAuthUserId();
    $stmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = :user_id ORDER BY id DESC");
    $stmt->execute(['user_id' => $userId]);
    $orders = $stmt->fetchAll();

    foreach ($orders as &$order) {
        if (!empty($order['items']) && is_string($order['items'])) {
            $order['items'] = json_decode($order['items'], true);
        }
    }

    echo json_encode(['data' => $orders]);
    exit;
}

// Creación de Orden: POST /api/orders
if ($method === 'POST' && ($uri === '/api/orders' || $uri === '/orders')) {
    $userId = getAuthUserId();
    $items = $body['items'] ?? [];
    $shippingAddress = trim($body['shipping_address'] ?? 'Dirección no especificada');

    if (empty($items)) {
        http_response_code(422);
        echo json_encode(['message' => 'No se proporcionaron artículos en la orden']);
        exit;
    }

    $total = 0;
    foreach ($items as $item) {
        $total += (float)($item['price'] ?? 0) * (int)($item['quantity'] ?? 1);
    }

    $stmt = $pdo->prepare("INSERT INTO orders (user_id, total, status, items, shipping_address) VALUES (:user_id, :total, 'pending', :items, :shipping_address) RETURNING id, user_id, total, status, items, created_at");
    $stmt->execute([
        'user_id' => $userId,
        'total' => $total,
        'items' => json_encode($items),
        'shipping_address' => $shippingAddress
    ]);
    $order = $stmt->fetch();
    if (!empty($order['items']) && is_string($order['items'])) {
        $order['items'] = json_decode($order['items'], true);
    }

    echo json_encode(['data' => $order]);
    exit;
}

// Procesar Pago con Stripe: POST /api/payments/process
if ($method === 'POST' && ($uri === '/api/payments/process' || $uri === '/payments/process')) {
    $orderId = (int)($body['order_id'] ?? 0);
    $paymentMethod = $body['payment_method_id'] ?? 'pm_card_visa';

    if (!$orderId) {
        http_response_code(422);
        echo json_encode(['message' => 'ID de orden no válido']);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE orders SET status = 'paid' WHERE id = :id");
    $stmt->execute(['id' => $orderId]);

    echo json_encode([
        'success' => true,
        'client_secret' => 'pi_test_stripe_' . bin2hex(random_bytes(8)),
        'message' => 'Pago procesado exitosamente con Stripe'
    ]);
    exit;
}

// Ruta no encontrada
http_response_code(404);
echo json_encode(['message' => 'Endpoint no encontrado: ' . $uri]);
