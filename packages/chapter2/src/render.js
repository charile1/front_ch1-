export function jsx(type, props, ...children) {
  return { type, props, children }
}

function createElement(node) {
  // jsx를 dom으로 변환
  /**
   * 1. node가 문자열인 경우 - 텍스트 노드를 생성하여 반환
   * 2. node가 객체인 경우 - element를 생성, element에 속성과 자식을 추가 후 요소 반환.
   */

  if (node === null || node === undefined) {
    return document.createDocumentFragment()
  }

  if (typeof node === "string") {
    return document.createTextNode(node)
  }

  if (typeof node === "object") {
    const element = document.createElement(node.type)
    Object.entries(node.props || {}).forEach(([name, value]) => {
      element.setAttribute(name, value)
    })

    node.children
      .map((child) => createElement(child))
      .forEach((childNode) => element.appendChild(childNode))

    return element
  }
}

function updateAttributes(element, newProps = {}, oldProps = {}) {
  // newProps들을 반복하여 각 속성과 값을 확인
  //   만약 oldProps에 같은 속성이 있고 값이 동일하다면
  //     다음 속성으로 넘어감 (변경 불필요)
  //   만약 위 조건에 해당하지 않는다면 (속성값이 다르거나 구속성에 없음)
  //     target에 해당 속성을 새 값으로 설정
  for (const attr in newProps) {
    if (newProps[attr] === oldProps[attr]) {
      continue
    } else {
      element.setAttribute(attr, newProps[attr])
    }
  }

  // oldProps을 반복하여 각 속성 확인
  //   만약 newProps들에 해당 속성이 존재한다면
  //     다음 속성으로 넘어감 (속성 유지 필요)
  //   만약 newProps들에 해당 속성이 존재하지 않는다면
  //     target에서 해당 속성을 제거
  for (const attr in oldProps) {
    if (attr in newProps) {
      continue
    } else {
      element.removeAttribute(attr)
    }
  }
}

export function render(parent, newNode = null, oldNode = null, index = 0) {
  // 변경하고자 하는 노드 위치를 찾음
  const targetNode = parent.childNodes[index]

  // 1. 만약 newNode가 없고 oldNode만 있다면
  //   parent에서 oldNode를 제거
  //   종료
  if (!newNode && oldNode) {
    parent.removeChild(targetNode)
    return
  }

  // 2. 만약 newNode가 있고 oldNode가 없다면
  //   newNode를 생성하여 parent에 추가
  //   종료
  if (newNode && !oldNode) {
    parent.appendChild(createElement(newNode))
    return
  }

  // 3. 만약 newNode와 oldNode 둘 다 문자열이고 서로 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (typeof newNode === "string" || typeof oldNode === "string") {
    if (newNode !== oldNode) {
      const newElement = createElement(newNode)
      parent.replaceChild(newElement, targetNode)
    }
    return
  }

  // 4. 만약 newNode와 oldNode의 타입이 다르다면
  //   oldNode를 newNode로 교체
  //   종료
  if (newNode.type !== oldNode.type) {
    parent.replaceChild(createElement(newNode), targetNode)
    return
  }

  // 5. newNode와 oldNode에 대해 updateAttributes 실행
  if (newNode.type === oldNode.type) {
    updateAttributes(targetNode, newNode.props || {}, oldNode.props)

    // 6. newNode와 oldNode 자식노드들 중 더 긴 길이를 가진 것을 기준으로 반복
    //   각 자식노드에 대해 재귀적으로 render 함수 호출
    const maxLength = Math.max(newNode.children.length, oldNode.children.length)
    for (let i = 0; i < maxLength; i++) {
      render(targetNode, newNode.children[i], oldNode.children[i], i)
    }

    for (let i = maxLength; i < targetNode.childNodes.length; i++) {
      targetNode.remove()
    }
  }
}
