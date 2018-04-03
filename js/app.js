(function (window,Vue) {
	'use strict';

	// Your starting point. Enjoy the ride!
	const todos = JSON.parse(window.localStorage.getItem("todos")) || [];

	// 注册一个全局自定义指令 'v-focus'
	// Vue操作DOM的推荐方式
	Vue.directive('focus',{
		inserted:function(el){
			el.focus();
		}
	})

	const app = new Vue({
		el: "#todoapp",
		data: {
			todos,
			inputText: "",
			currentEdit: null,
			backTitle: "",
			filterTodos:[],
			hash:""
		},
		methods: {
			//添加
			addTodo(e) {
				if (this.inputText.trim().length === 0) {
					return
				}
				const id = this.todos[this.todos.length - 1] ? this.todos[this.todos.length - 1].id + 1 : 1;

				this.todos.push({
					id,
					title: this.inputText,
					done: false
				})
				this.inputText = "";
			},

			//删除
			removeTodo(item) {
				//根据item.id找到元素的索引
				//根据索引删除
				// es6 新增的一个数组方法 findIndex
				// findIndex 会遍历数组，对数组的每一项调用你传递的回调函数
				// 当某个元素满足 条件时 停止遍历 返回改元素项在数组中索引
				// 如果遍历结束没有找到 返回索引 -1
				const index = this.todos.findIndex(function (t) {
					return t.id === item.id;
				})
				if (index !== -1 ){
					this.todos.splice(index, 1);
				}

			},

			//获得编辑样式
			getEditing(item) {
				this.currentEdit = item;
				this.backTitle = item.title;
			},

			//保存编辑
			saveEdit(item, index) {
				if (item.title.trim().length === 0) {
					this.todos.splice(index, 1);
				} else {
					this.currentEdit = null;
				}

			},

			//去除编辑样式
			cancelEdit() {
				this.currentEdit.title = this.backTitle;
				this.currentEdit = null;
			},
			//清除所有已完成任务项
			clearAllDone() {
				const todos = this.todos;
				for (let i = 0; i < todos.length; i++) {
					if (todos[i].done === true) {
						//执行删除操作
						todos.splice(i, 1);
						i--;
					}
				}
			}
		},
		// 计算属性选项对象
		// 本质是方法，但只能当做属性来使用 
		// 计算属性和方法来对比为唯一区别：
		// 计算属性会把计算的结果进行缓存
		// 多次说用该计算属性 实际只调用了一次
		// 方法则是使用一次调用一次
		computed: {
			//获取未完成的任务数
			remaining() {
				return this.todos.filter(item => !item.done).length;
			},
			//切换所有任务项的任务状态
			toggleAllStat: {
				get: function () {
					return this.todos.every(item => { return item.done })
				},
				set: function (val) {
					this.todos.forEach(function (item) {
						item.done = val;

					})
					

				}

			}
		},

		//watch 实例选项 
		//一个对象
		// 对象的key 必须是要被监视的实例成员（data中的数据成员、计算属性中的成员）
		watch: {
			todos: {
				//默认状态下，只能监视对象或者数组成员的添加或者删除
				//当todos发生变化时自动调用handler方法
				handler: function () {
					//todos发生变化同步到本地存储
					window.localStorage.setItem("todos", JSON.stringify(this.todos));
					window.onhashchange();					
				},
				deep: true //默认只监视对象或者数组的一层数据，如果需要无级后代监视，需配置为true
			}
		},

		directives:{
			//对象的key就是自定义指令的名字
			// 选项对象用来配置指令的声明周期钩子函数
			"todo-focus":{
				// bind(el,binding){},
				// inserted(el,binding){},
				update(el,binding){
					if(binding.value === true){
						el.focus()
					}
				}
				// componentUpdated(el,binding){},
				// unbind(el,binding){}

			}
		}
	})

	window.app = app;
	//只有锚点变化才会调用
	window.onhashchange = function () {
		const {hash} = window.location;

		//修改实例中的属性hash从而解决
		app.hash = hash;
		switch (hash) {
			case "":
				app.filterTodos = app.todos;
				break;
			case "#/" :
				app.filterTodos = app.todos;
				break;
			case "#/active":
				app.filterTodos = app.todos.filter(function (item) {
					return item.done === false
				})
				break;
			case "#/completed":
				app.filterTodos = app.todos.filter(function (item) {
					return item.done === true
				})
				break;
		}
	}
	//初始化过滤的数据
	window.onhashchange();
})(window,Vue);
