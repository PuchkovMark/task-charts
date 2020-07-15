new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data() {
        return {
            isDark: true,
            show: true,
            todoTitle: '',
            carts: []
        }
    },
    async created() {
        this.carts = await (await fetch('http://localhost:3000/api/carts')).json()

      let rows = []
        for (let i = 0; i < this.carts.length; i++) {
            rows.push(this.carts[i])
        }
        console.log(rows)

        google.charts.load('current', {packages: ['corechart', 'line']});
        google.charts.setOnLoadCallback(drawTrendlines);


      async function drawTrendlines() {
        const data = await new google.visualization.DataTable();
        data.addColumn('number', 'X');
        data.addColumn('number', '1');


          for (let i = 0; i < document.querySelectorAll('.chart_div').length; i++) {

              console.log(rows[i])
              data.addRows(rows[i]?.data);

              const options = {
                  hAxis: {
                      title: 'xAxis'
                  },
                  vAxis: {
                      title: 'yAxis'
                  },
                  colors: ['#AB0D06', '#007329'],
              };

            let chart = await new google.visualization.LineChart(document.querySelectorAll('.chart_div')[i])
            chart.draw(data, options);
          }
        }
    },
    methods: {
        addTodo() {
            const title = this.todoTitle.trim()
            if (!title) {
                return
            }
            fetch('/api/carts', {
                method: 'post',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({title})
            })
                .then(res => res.json())
                .then(({todo}) => {
                    this.todos.push(todo)
                    this.todoTitle = ''
                })
                .catch(e => console.log(e))
        },
        removeTodo(id) {
            fetch('/api/carts/' + id, {
                method: 'delete'
            })
                .then(() => {
                    this.todos = this.todos.filter(t => t.id !== id)
                })
                .catch(e => console.log(e))
        },
        completeTodo(id) {
            fetch('/api/carts/' + id, {
                method: 'put',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({done: true})
            })
                .then(res => res.json())
                .then(({todo}) => {
                    const idx = this.todos.findIndex(t => t.id === todo.id)
                    this.todos[idx].updatedAt = todo.updatedAt
                })
                .catch(e => console.log(e))
        }
    },
    filters: {
        capitalize(value) {
            //return value.toString().charAt(0).toUpperCase() + value.slice(1)
        },
        date(value, withTime) {
            const options = {
                year: 'numeric',
                month: 'long',
                day: '2-digit'
            }

            if (withTime) {
                options.hour = '2-digit'
                options.minute = '2-digit'
                options.second = '2-digit'
            }
            return new Intl.DateTimeFormat('ru-RU', options).format(new Date(value))
        }
    }
})