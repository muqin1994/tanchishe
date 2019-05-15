; (function (window) {
    //所有关于食物的呃代码都在这里

    //创建一个空数组存放食物
    var list = [];
    //创建一个食物对象的构造函数
    function Food(width, height, bgColor, x, y) {
        this.width = width || 20;
        this.height = height || 20;
        this.bgColor = bgColor || 'green';;
        this.x = x || 0;
        this.y = y || 0;
    }

    //把食物显示在地图上
    Food.prototype.render = function (map) {
        //渲染新食物之前删除老食物
        remove(map);

        //随机产生一个食物x,y坐标
        this.x = Math.floor(Math.random() * map.offsetWidth / this.width) * this.width;
        this.y = Math.floor(Math.random() * map.offsetHeight / this.height) * this.height;
        //创建一个div让这个div拥有食物的所有显示信息
        var div1 = document.createElement('div');
        div1.style.position = 'absolute';
        div1.style.left = this.x + 'px';
        div1.style.top = this.y + 'px';
        div1.style.width = this.width + 'px';
        div1.style.height = this.height + 'px';
        div1.style.backgroundColor = this.bgColor;
        //把这个div添加到地图上
        map.appendChild(div1);

        //把显示食物的div存起来
        list.push(div1);
    }

    //写一个移出老食物的方法
    function remove(map) {
        //通过list数组找到div,用map地图对象来移出
        for (var i = 0; i < list.length; i++) {
            map.removeChild(list[i]);
        }
        //清空这个数组
        list = [];
    }

    //把Food暴露给window
    window.Food = Food;
}(window));

//.................................................

; (function (window) {
    //所有关于蛇的代码

    //随机产生一个十六进制的颜色函数
    function getColorRandom() {
        var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];  //下标0-15
        var str = '#';
        //循环产生6个0-15的数
        for (var i = 0; i < 6; i++) {
          var num = Math.floor(Math.random() * 16);
    
          //根据这个随机数,在arr数组中去取值
          str += arr[num];
        }
        return str;
      }

    //写蛇
    //创建一个list 数组来保存蛇
    var list = [];

    //蛇有宽高,坐标,背景色,所有蛇是对象
    function Snake(width, height, direction) {
        this.width = width || 20;
        this.height = height || 20;
        this.direction = direction || 'right';
        //body表示的 是蛇的身体,是一个数组
        this.body = [
            { x: 3, y: 1, bgColor: 'red' },
            { x: 2, y: 1, bgColor: 'green' },
            { x: 1, y: 1, bgColor: 'pink' },
        ];
    };

    //把蛇对象渲染到地图上的代码封装成函数,这个函数写在原型
    Snake.prototype.render = function (map) {
        //渲染新的蛇之前删除老蛇
        remove(map);

        //蛇有很多节身体.渲染每一节身体代码都一样,用for循环来遍历
        for (var i = 0; i < this.body.length; i++) {
            //创建一个新的div
            var div1 = document.createElement('div');
            //让这个div有这个蛇对象的所有显示信息
            div1.style.position = "absolute";
            div1.style.width = this.width + 'px';
            div1.style.height = this.height + 'px';
            div1.style.left = this.body[i].x * this.width + 'px'; //坐标 = 下标 * 宽.
            div1.style.top = this.body[i].y * this.height + 'px';
            div1.style.backgroundColor = this.body[i].bgColor;
            //把这个div添加到地图上
            map.appendChild(div1);
            //把显示蛇的div记录起来
            list.push(div1);
        };
    };

    //删除老蛇私有方法
    //移出map中的那个div的老蛇对应的div
    function remove(map){
        //从list数组中找到老蛇,然后从map中移出
        for(var i = 0;i<list.length;i++){
            map.removeChild(list[i]);
        }
        //清空数组
        list.length = 0;
    };

    //让蛇动起来
    //封装一个方法写在原型,这样就可以直接调用
    Snake.prototype.move = function(food,map){
        //除了蛇头之外的蛇身体移动改变坐标
        //移出之后的坐标是上一节移动之前的坐标
        for (var i = this.body.length - 1; i > 0; i--) {
            this.body[i].x = this.body[i - 1].x;
            this.body[i].y = this.body[i - 1].y;
          }

        //蛇头移动改变坐标
        //根据方向移动
        switch(this.direction){
            case 'right':
            this.body[0].x++;
            break;
            case "left":
            this.body[0].x--;
            break;
          case "top":
            this.body[0].y--;
            break;
          case "bottom":
            this.body[0].y++;
            break;
        };

        //判断蛇头有没有吃到食物
        //判断蛇头的坐标有没有和食物的做报表重叠
        var snakeHeadX  = this.body[0].x*this.width;//蛇头的x坐标
        var snakeHeadY  = this.body[0].y*this.height;//蛇头的y坐标
        var foodX = food.x;//食物的x坐标
        var foodY = food.y;//食物的y坐标
        //拿到蛇尾巴的xy坐标
        var lastSnakeUnit = this.body[this.body.length-1];
        //判断
        if(snakeHeadX == foodX && snakeHeadY == foodY){
            //表示吃到了食物
            this.body.push({
                x:lastSnakeUnit.x,
                y:lastSnakeUnit.y,
                bgColor:getColorRandom()
            });
            //产生一个新的食物
            //调用一个食物对象的render方法,重新给这个食物产生新的坐标
            food.render(map);
        };
    };

    //把Snake暴露给window
    window.Snake = Snake;
}(window));

//....................................................

;(function(window){
    //所有关于游戏控制逻辑的代码

    //声明一个变量来记录游戏控制器对象
    var that = null;

    //游戏控制器的构造函数
    function Game(map){
        //游戏控制器对象,包含游戏的蛇和食物还有游戏的地图
        this.snake = new Snake();
        this.food = new Food();
        this.map = map;

        //给that赋值
        that = this;
    };

    //写一个游戏开始的方法,让这个游戏开始
    //这个方法写在原型
    Game.prototype.start = function(){
        //这里的this表示的是游戏控制器对象
        //显示食物
        this.food.render(this.map);
        this.snake.render(this.map);

        //让蛇动起来,调用蛇对象的move方法
        snakeAutoMove();
        //让蛇跟着键盘方向移动
        bindkey();
    };

    //封装一个方法,让蛇跟随键盘方向移动
    function bindkey(){
        //给document注册一个键盘按下事件
        document.onkeydown = function(e){
            e = e || window.event;
            switch (e.keyCode) {
                case 37:
                if(this.snake.direction != "right"){
                  this.snake.direction = "left";
                }
                break;
                case 38:
                  if (this.snake.direction != "bottom") {
                    this.snake.direction = "top";
                  }
                  break;
                case 39:
                  if (this.snake.direction != "left") {
                    this.snake.direction = "right";
                  }
                  break;
                case 40:
                  if (this.snake.direction != 'top') {
                    this.snake.direction = "bottom";
                  }
                  break;
              };
        }.bind(that);
    };

    //写一个方法让蛇不停的移动
    //用计时器,不停的调用蛇的move方法和蛇的rednder方法
    function snakeAutoMove(){
        var timeID = setInterval(function(){
            this.snake.move(this.food,this.map);

            //判断蛇是否出界
            //先判断蛇头的xy坐标
            var snakeHeadX = this.snake.body[0].x*this.snake.width;
            var snakeHeadY = this.snake.body[0].y*this.snake.height;
            //判断出界条件
            if (snakeHeadX < 0 || snakeHeadX >= this.map.offsetWidth || snakeHeadY < 0 || snakeHeadY >= this.map.offsetHeight) {
                //结束游戏
                alert('游戏结束,彩笔!');
                //清空计时器
                clearInterval(timeID);
                return;   
            };
            //如果蛇移动产生新的坐标,新坐标出界了那上面就会有return,就不会在执行这个渲染代码
            this.snake.render(this.map);
        }.bind(that),200);
    };

    //把这个Game暴露给window
    window.Game = Game;
}(window));