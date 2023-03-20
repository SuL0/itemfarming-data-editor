import React, { useState, useEffect, useReducer } from "react";
import Tree from './component/tree';
import 'bootstrap/dist/css/bootstrap.min.css';
import undoableTreeData from "./component/undoable-tree-data";
import FileDragAndDrop from './component/file-drag-and-drop';
import JsonViewer from './component/json-viewer'
import { parseFarmingDataToTreeData, parseTreeDataToFarmingData, validateTreeData } from "./component/data-parser";
import SplitPane from 'react-split-pane';
import Pane from 'react-split-pane/lib/Pane';
import Box from '@mui/material/Box';
import registerUndoRedoShortcut from "./component/undo-redo-shortcut";

// ctrl+z, ctrl+y 단축키로서 undo redo
// 브라우저 캐시 저장소를 이용해서 강제 종료되더라도 진행사항을 저장하게끔 만들기

function App() {
  const [fileName, setFileName] = useState()
  const [treeDataState, dispatchTreeData] = useReducer(undoableTreeData())
  
  useEffect(() => {
    return registerUndoRedoShortcut(dispatchTreeData)
  }, []);

  const onReceiveFile = (file) => {
    setFileName(file.name);
    
    const reader = new FileReader();

    reader.onload = (e) => {
      const jsonObj = JSON.parse(e.target.result);
      const treeData = parseFarmingDataToTreeData(jsonObj)
      dispatchTreeData({
        type: 'SET_VALUE',
        payload: treeData
      })
    }
    reader.readAsText(file, 'utf-8')
  };

  const setTreeDataHandler = (givenTreeData) => {
    dispatchTreeData({
      type: 'SET_VALUE',
      payload: validateTreeData(givenTreeData)
    })
  }

  return (
    <Box height="100vh" display="flex"  flexDirection="column">
      <Box ml={2}>
        <h4>{fileName && fileName}</h4>
      </Box>
      {
        !treeDataState ?
        <FileDragAndDrop message={"json 파밍 설정 파일을 업로드하세요"} onReceiveFile={onReceiveFile}/>
        :
        <SplitPane split="vertical" minSize={500} defaultSize={1000}>
          <Pane initialSize="50%" minSize="35%">
            <Tree treeData={treeDataState.present} setTreeData={setTreeDataHandler}/>
          </Pane>
          <Pane initialSize="50%" minSize="20%">
            <JsonViewer jsonObj={parseTreeDataToFarmingData(treeDataState.present)}/>
          </Pane>
        </SplitPane>
      }
    </Box>
  );
}
export default App;
