export const parseFarmingDataToTreeData = (farmingData) => {
  const newFarmingData = recursiveTransformJson(farmingData, (jsonObj, parsedChildren) => {
    const { children, name, chance, ...rest } = jsonObj  // ...rest 할 시 키 children, name, chance는 제외된 '키-값' 만 나옴
    return {
      ...rest,
      title: jsonObj.name,
      subtitle: `${jsonObj.chance}%`,
      expanded: true,
      ...(parsedChildren ? { children: parsedChildren } : {})
    }
  })
  return removeNodeAtTheTop(newFarmingData)
}
export const parseTreeDataToFarmingData = (treeData) => {
  const rootChildren = []
  
  treeData.forEach(element =>
    rootChildren.push(recursiveTransformJson(element, (jsonObj, transformedChildren) => {
      const { children, title, subtitle, expanded, ...rest } = jsonObj
      return {
        ...rest,
        name: jsonObj.title,
        chance: jsonObj.subtitle.replace('%', ''),
        ...(transformedChildren ? { children: transformedChildren } : {})
      }
    }))
  )
  return wrapWithNodeAtTheTop(rootChildren)
}

// children의 length가 0이면 children을 삭제
export const validateTreeData = (treeData) => {
  const rootChildren = []

  treeData.forEach(element =>
    rootChildren.push(recursiveTransformJson(element, (jsonObj, transformedChildren) => {
      const { children, ...rest } = jsonObj
      return {
        ...rest,
        ...(transformedChildren ? { children: transformedChildren } : {})
      }
    }))
  )

  return rootChildren
}





function removeNodeAtTheTop(jsonObj) {
  return jsonObj.children
}
function wrapWithNodeAtTheTop(children) {
  return {
    name: "NodeAtTheTop",
    chance: 100.0,
    children: children
  }
}



function recursiveTransformJson(jsonObj, howToTransform) {
  const children = jsonObj.children && jsonObj.children.length > 0 ? jsonObj.children.map(child => recursiveTransformJson(child, howToTransform)): null;
  return howToTransform(jsonObj, children);
}