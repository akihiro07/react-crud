import React, { Component } from 'react';
//import classNames from 'classnames'
import '../App.scss';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import backgroundImage from '../image/background-img.png'


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
  submitTask(e) {
    document.form.taskFormInput.value="";
    // [参考]https://qiita.com/koheiyamaguchi0203/items/5777c4653a01ae4c7b06
    fetch("http://localhost:3001/tasks", {
      method: "POST",
      headers: {
        // https://wa3.i-3-i.info/word15819.html
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      // JSON形式に変換(db.jsonへ)
      body: JSON.stringify({ todoText: this.state.inputText, isDone: false} )
    })
    // データを取得する関数呼び出し
    .then( this.fetchTasks )
  }

  // データ更新
  doneTask(taskId) {
    fetch("http://localhost:3001/tasks/"+taskId, {
      method: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ todoText: "DONE!!"} )
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
      <div id="app">

        <img className="background-image" src={backgroundImage}  alt="猫の画像" />
        <div className="title">
          <span className="title__text">TASK MANAGER</span>
        </div>
        <main id="main">
          <div className="tasks">
            {
              this.state.tasks.map( task => {
                return (
                  <div className="task" key={ task.id }>
                    {/* [参考]https://qiita.com/cubdesign/items/ee8bff7073ebe1979936 */}
                    <FormControlLabel className="task__done" control={<Checkbox value="checkedC" />} onClick={ () => {this.doneTask(task.id)} } />
                    <span className="task__text">{ task.todoText }</span>
                    <Button className="task__delete" variant="contained" color="default" startIcon={<DeleteIcon />} onClick={ () => {this.deleteTask(task.id)} }>DELETE</Button>
                  </div>
                )
              })
            }
          </div>
          {/* formの書き方 */}
          <form name="form" id="task-form">
            <p>↓追加してねっ↓</p>
            <label className="task-form__label">{/* forは使用しない？ */}
              <input type="text" className="task-form__input" name="taskFormInput" onChange={ (e) => {this.changeText(e)} }/>
            </label>
            <Button variant="contained" color="primary" className="task-form__submit" onClick={ (e) => {this.submitTask(e)} }>submit</Button>
          </form>
        </main>
      </div>
    );
  }
}

export default App;