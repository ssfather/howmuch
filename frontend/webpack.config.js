module.exports = {
  devServer: {
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      // 여기에 미들웨어 설정
      
      return middlewares;
    }
  }
}; 