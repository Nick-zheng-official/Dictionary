// 导入必要的模块
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

// 创建Express应用
const app = express();
const PORT = 3000;

// 配置中间件
app.use(cors()); // 允许跨域请求
app.use(bodyParser.json({ limit: '10mb' })); // 解析JSON请求体

// 提供静态文件服务，将当前目录作为静态文件目录
app.use(express.static(__dirname));

// 配置路由，确保默认打开index.html而不是launcher
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 数据存储目录
const DATA_DIR = path.join(__dirname, 'data');

// 确保数据目录存在
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// API端点：保存用户数据
app.post('/api/save-data', (req, res) => {
    try {
        const { username, data } = req.body;
        
        if (!username || !data) {
            return res.status(400).json({ success: false, message: '用户名和数据不能为空' });
        }
        
        // 为用户创建数据文件路径
        const userFilePath = path.join(DATA_DIR, `${username}_data.json`);
        
        // 写入数据到文件
        fs.writeFileSync(userFilePath, JSON.stringify(data, null, 2));
        
        res.json({ success: true, message: '数据保存成功' });
    } catch (error) {
        console.error('保存数据时出错:', error);
        res.status(500).json({ success: false, message: '服务器错误', error: error.message });
    }
});

// API端点：获取用户数据
app.get('/api/get-data/:username', (req, res) => {
    try {
        const { username } = req.params;
        
        if (!username) {
            return res.status(400).json({ success: false, message: '用户名不能为空' });
        }
        
        // 用户数据文件路径
        const userFilePath = path.join(DATA_DIR, `${username}_data.json`);
        
        // 检查文件是否存在
        if (!fs.existsSync(userFilePath)) {
            return res.json({ success: true, data: null, message: '没有找到用户数据' });
        }
        
        // 读取数据文件
        const data = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
        
        res.json({ success: true, data });
    } catch (error) {
        console.error('获取数据时出错:', error);
        res.status(500).json({ success: false, message: '服务器错误', error: error.message });
    }
});

// API端点：保存学习日历数据
app.post('/api/save-calendar', (req, res) => {
    try {
        const { username, calendarData } = req.body;
        
        if (!username || !calendarData) {
            return res.status(400).json({ success: false, message: '用户名和日历数据不能为空' });
        }
        
        // 日历数据文件路径
        const calendarFilePath = path.join(DATA_DIR, `${username}_calendar.json`);
        
        // 写入日历数据
        fs.writeFileSync(calendarFilePath, JSON.stringify(calendarData, null, 2));
        
        res.json({ success: true, message: '日历数据保存成功' });
    } catch (error) {
        console.error('保存日历数据时出错:', error);
        res.status(500).json({ success: false, message: '服务器错误', error: error.message });
    }
});

// API端点：获取学习日历数据
app.get('/api/get-calendar/:username', (req, res) => {
    try {
        const { username } = req.params;
        
        if (!username) {
            return res.status(400).json({ success: false, message: '用户名不能为空' });
        }
        
        // 日历数据文件路径
        const calendarFilePath = path.join(DATA_DIR, `${username}_calendar.json`);
        
        // 检查文件是否存在
        if (!fs.existsSync(calendarFilePath)) {
            return res.json({ success: true, calendarData: {}, message: '没有找到日历数据' });
        }
        
        // 读取日历数据
        const calendarData = JSON.parse(fs.readFileSync(calendarFilePath, 'utf8'));
        
        res.json({ success: true, calendarData });
    } catch (error) {
        console.error('获取日历数据时出错:', error);
        res.status(500).json({ success: false, message: '服务器错误', error: error.message });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log('可用API端点:');
    console.log(`- POST http://localhost:${PORT}/api/save-data - 保存用户数据`);
    console.log(`- GET http://localhost:${PORT}/api/get-data/:username - 获取用户数据`);
    console.log(`- POST http://localhost:${PORT}/api/save-calendar - 保存日历数据`);
    console.log(`- GET http://localhost:${PORT}/api/get-calendar/:username - 获取日历数据`);
});