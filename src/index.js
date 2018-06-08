import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import ReactiveTable from './ReactiveTable';
import registerServiceWorker from './registerServiceWorker';
import Data from './dane.json';
import ColumnNames from './columnNames.json';

let defStyle = {table: "items", thead: "", tbody: ""};

ReactDOM.render(<ReactiveTable allDataSet={Data} columnNames={ColumnNames} defaultSortParam={"age"} defaultStyle={defStyle}/>, document.getElementById('root'));
registerServiceWorker();
