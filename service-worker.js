// 不使用缓存，直接通过网络获取资源
self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

// 处理 fetch 事件
self.addEventListener('fetch', event => {
  if (event.request.method === 'POST' && event.request.url.endsWith('/addUser')) {
    event.respondWith(handleAddUser(event.request));
  }
});

async function handleAddUser(request) {
  try {
    const { username, password } = await request.json(); // 从请求体提取 username 和 password

    // 定义 SQL 查询
    const query = `INSERT INTO users (username, password, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)`;
    
    // 使用您的数据库名称 libretv
    const db = await libretv.prepare(query);
    await db.bind(username, password).run(); // 绑定参数并运行查询

    return new Response('User added successfully', { status: 200 });
  } catch (error) {
    return new Response('Error adding user: ' + error.message, { status: 500 });
  }
}