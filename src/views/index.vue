<template>
    <div class="block">
      <div id="Panel" class="panel">
      <h2 id="Score">Score: 0</h2>
      <button @click="this.startGame">Start Game</button>
      </div>
      <canvas id="mycanvas"></canvas>
    </div>
</template>

<style>
html,
body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  margin: 0;
  background-color: #FAC126;
}

canvas {
  max-width: 100vmin;
}
.block {
  display: flex;
  justify-content: center;
  align-items: center;
}
.panel {
  position: absolute;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 50px;
}

button {
  background-color: transparent;
  border: solid 1px white;
  border-radius: 20px;
  padding: 5px 10px;
  color: white;
  cursor: pointer;
  outline: none;
}

button:hover {
  background-color: #fff;
  color: black;
}
</style>

<script>
import * as Tone from 'tone'

export default {
  name: 'mySnake',
  watch: {
  },
  data () {
    return {
      snake: {
        body: [],
        maxLength: 5,
        head: new this.Vector(0, 0),
        speed: new this.Vector(1, 0),
        direction: 'Right'
      },
      Game: {
        bw: 12,
        bs: 2,
        gameWidth: 40,
        speed: 30,
        foods: [],
        start: false,
      }
    }
  },
  computed: {
  },
  methods: {
    Vector: function(x, y) {
      this.x = x
      this.y = y
    },

    // --- snake ---
    // step1: function
    snakeUpdate: function () {
      let newHead = new this.Vector(this.snake.head.x + this.snake.speed.x, this.snake.head.y + this.snake.speed.y)
      // old head
      this.snake.body.push(this.snake.head)
      this.snake.head = newHead
      while (this.snake.body.length > this.snake.maxLength) {
        this.snake.body.shift()
      }
    },
    setDirection: function(dir) {
      var target
      if(dir === 'Up') {
        target = new this.Vector(0,-1)
      }
      if(dir === 'Down') {
        target = new this.Vector(0,1)
      }
      if(dir === 'Left') {
        target = new this.Vector(-1,0)
      }
      if(dir === 'Right') {
        target = new this.Vector(1,0)
      }

      this.snake.speed = target
    },
    // check ranger
    checkRange: function(gameWidth) {
      let xInRanger = this.snake.head.x >= 0  && this.snake.head.x <= gameWidth
      let yInRanger = this.snake.head.y >= 0  && this.snake.head.y <= gameWidth

      return xInRanger && yInRanger
    },

    // ---- game ----
    // block position
    getPosition: function(x,y) {
      return new this.Vector(x * this.Game.bw + (x - 1) * this.Game.bs,
          y * this.Game.bw + (y - 1) * this.Game.bs)
    },
    // drawBlock
    drawBlock: function (v, color) {
      this.ctx.fillStyle = color
      // set position
      let pos = this.getPosition(v.x, v.y)
      // 填滿
      this.ctx.fillRect(pos.x, pos.y, this.Game.bw, this.Game.bw)
    },
    // food
    generateFood: function() {
      var x = parseInt(Math.random() * this.Game.gameWidth)
      var y = parseInt(Math.random() * this.Game.gameWidth)

      this.Game.foods.push(new this.Vector(x,y))
      this.foodAnimation(x,y)

      // sound
      this.playSound('E5', -20)
      this.playSound('A5', -20, 50)
    },
    // food animation
    foodAnimation: function(x,y) {
      var r = 2
      var pos = this.getPosition(x,y)
      var _this = this
      // circus canvas
      var effect = function() {
        r++
        _this.ctx.strokeStyle = 'rgba(255, 133, 133,' + (100 - r) / 100 + ')'
        _this.ctx.beginPath()
        _this.ctx.arc(pos.x + _this.Game.bw / 2, pos.y + _this.Game.bw / 2, r, 0 ,Math.PI *2)
        _this.ctx.stroke()

        if(r<100) {
          requestAnimationFrame(effect)
        }
      }
      requestAnimationFrame(effect)
    },
    startGame: function() {
      this.Game.start = true
      document.getElementById('Panel').style.display='none'

      // 初始化
      this.snake = {
          body: [],
          maxLength: 5,
          head: new this.Vector(0, 0),
          speed: new this.Vector(1, 0),
          direction: 'Right'
      }
      // sound
      this.playSound('C#5', -20)
      this.playSound('E5', -20, 200)
    },
    endGame: function() {
      this.Game.start = false
      document.getElementById('Panel').style.display='block'
      document.getElementById('Score').textContent=`Score: ${(this.snake.body.length-5)*10}`
      // sound
      // this.playSound('E4')
      // this.playSound('G4', -10, 200)
      // this.playSound('E4', -10, 400)
      const synth = new Tone.Synth().toDestination();
      const now = Tone.now()
      synth.triggerAttackRelease("C4", "8n", now)
      synth.triggerAttackRelease("E4", "8n", now + 0.5)
      synth.triggerAttackRelease("G4", "8n", now + 1)
      synth.triggerAttackRelease("C5", "8n", now + 1.5)

      synth.autostart = false
    },
    // render game 繪圖
    gameRender: function () {
      this.ctx.fillStyle = 'rgba(16, 170, 201,0.3)'
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
      // render drawBlock
      for(var x = 0; x< this.Game.gameWidth; x++) {
        for(var y = 0; y<this.Game.gameWidth; y++) {
          this.drawBlock(new this.Vector(x,y), 'rgba(38, 214, 250,0.12)')
        }
      }

      // snake animation render
      // step2 render
      this.snake.body.forEach((snakePosition)=> {
        this.drawBlock(snakePosition, 'rgba(255,255,255,255)')
      })

      this.Game.foods.forEach((item) => {
        this.drawBlock(item, 'rgba(254, 105, 105)')
      })

      // 重複執行
      requestAnimationFrame(() => {
        this.gameRender()
      })
    },
    // update game 即時更新
    gameUpdate: function() {
      requestAnimationFrame(()=> {
        if(this.Game.start) {
          // sound
          this.playSound('A2', 0)
          // step3 update setTimeout
          this.snakeUpdate()

          this.Game.foods.forEach((food,index)=> {
            if(this.snake.head.x === food.x && this.snake.head.y === food.y) {
              this.snake.maxLength++
              this.Game.foods.splice(index,1)

              this.generateFood()
            }
          })
        }
        // 身體對撞
        this.snake.body.forEach((body)=> {
          if (this.snake.head.x === body.x && this.snake.head.y === body.y) {
              this.endGame()
          }
        })
        if(this.checkRange(this.Game.gameWidth) === false) {
          this.endGame()
        }
        setTimeout(() => {
           this.gameUpdate()
      }, 150)
      })
    },

    // sound
    playSound: function(note, when) {
      setTimeout(function() {
        const synth = new Tone.Synth().toDestination()
        // 聲音大小
        // synth.volume = volume || -12
        // 音度
        synth.triggerAttackRelease(note, '8n')
      }, when || 0)
    },
    // init game 渲染
    async gameInit () {
      this.canvas = document.getElementById('mycanvas')
      this.canvas.width = this.Game.bw * this.Game.gameWidth + this.Game.bs * (this.Game.gameWidth - 1)
      this.canvas.height = this.canvas.width
      // set 2d
      this.ctx = this.canvas.getContext('2d')
      this.gameRender()
      this.gameUpdate()
      // food
      this.generateFood()
    },
  },
  mounted () {
    this.gameInit()
    window.addEventListener('keydown', event => {
      this.setDirection(event.key.replace('Arrow',''))
    })
  }
}

</script>
