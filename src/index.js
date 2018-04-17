import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ReactiveTable from './ReactiveTable';
import registerServiceWorker from './registerServiceWorker';
import Data from './dane.json';
import ColumnNames from './columnNames.json';

ReactDOM.render(<ReactiveTable allDataSet={Data} columnNames={ColumnNames} defaultSortParam={"age"}/>, document.getElementById('root'));
registerServiceWorker();
