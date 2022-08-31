module.exports = {
    // baseUrl: './',
    // assetsDir: 'static',
    // productionSourceMap: false,
    // devServer: {
    //     proxy: {
    //         '/api':{
    //             target:'http://jsonplaceholder.typicode.com',
    //             changeOrigin:true,
    //             pathRewrite:{
    //                 '/api':''
    //             }
    //         }
    //     }
    // }

    devServer: {
        proxy: {
            '/': {
                target: 'http://127.0.0.1:8888', //代理接口 
                changeOrigin: true,
                pathRewrite: {
                    '^/': '/' //代理的路径
                }
            }
        }
    }
}