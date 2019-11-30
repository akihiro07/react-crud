import React, { Component } from 'react';
import './App.css';

// [参考][json-server]https://app.codegrid.net/entry/2017-json-server-1
class App extends Component {
  constructor() {
    super()
    this.state = {
      tasks: []
    }
    this.fetchTasks = this.fetchTasks.bind(this)
  }

  // Appコンポーネントがマウントされる直前（ライフサイクル）
  componentWillMount() {
    this.fetchTasks()
  }

  // データを取得してsetState(state->tasks)
  fetchTasks() {
    // データ取得
    // [参考]https://developer.mozilla.org/ja/docs/Web/API/Fetch_API/Using_Fetch
    // [参考]https://azu.github.io/promises-book/
    fetch("http://localhost:3001/tasks")
    // json形式のresponseをオブジェクトに変換
    .then(response => response.json())
    // オブジェクトに変換したresponseをsetState
    .then(json => {
      this.setState({ tasks: json })
    })
  }

  // 入力した値をsetState(state->inputText)
  changeText(e) {
    const inputText = e.target.value
    this.setState({ inputText: inputText })
  }

  // 入力した値
  submitTask() {
    // [参考]https://qiita.com/koheiyamaguchi0203/items/5777c4653a01ae4c7b06
    fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: {
        // https://wa3.i-3-i.info/word15819.html
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      // JSON形式に変換(db.jsonへ)
      body: JSON.stringify({ body: this.state.inputText })
    })
    // データを取得する関数呼び出し
    .then( this.fetchTasks )
  }

  // データ更新
  putTask(taskId) {
    fetch("http://localhost:3001/tasks/"+taskId, {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ body: "DONE！！" })
    })
    .then( this.fetchTasks )
  }

  // データ削除
  deleteTask(taskId) {
    fetch("http://localhost:3001/tasks/"+taskId, {
      method: "DELETE"
    })
    .then( this.fetchTasks )
  }

  render() {
    return (
      <div className="App">
        <div className="tasks">
          {
            this.state.tasks.map( task => {
              return (
                <div className="task" key={ task.id }>
                  { task.body }
                  {/* [参考]https://qiita.com/cubdesign/items/ee8bff7073ebe1979936 */}
                  <button className="put" onClick={ () => {this.putTask(task.id)} }>PUT</button>
                  <button className="delete" onClick={ () => {this.deleteTask(task.id)} }>DELETE</button>
                </div>
              )
            })
          }
        </div>
        {/* formの書き方 */}
        <div id="task-form">
          <label>{/* forは使用しない？ */}
            <p>↓追加してねっ↓</p>
            <input type="text" id="task-input" onChange={ (e) => {this.changeText(e)} }/>
          </label>
          <button id="submit" onClick={ () => {this.submitTask()} }>submit</button>
        </div>
      </div>
    );
  }
}

export default App;