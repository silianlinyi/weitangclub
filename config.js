/**
 * 项目配置文件
 *
 * MONGODB_IP: 			MongoDB数据库服务器IP地址
 * MONGODB_DATABASE: 	MongoDB数据库名字
 * WEB_SERVER_PORT: 	Web服务器端口号，发布80，测试8080
 *
 */
module.exports = {
    name: "微糖",
    description: "分享知识，分享快乐！",

    MONGODB_IP: "127.0.0.1",
    MONGODB_PORT: 27017,
    MONGODB_DATABASE_NAME: "weitang",
    WEB_SERVER_PORT: 8080,

    DOMAIN: '127.0.0.1:8080',

    mailOpts: {
        host: 'smtp.126.com',
        port: 25,
        auth: {
            user: 'weitangclub@126.com',
            pass: 'kyle890829'
        }
    }


}