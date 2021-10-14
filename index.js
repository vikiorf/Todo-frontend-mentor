const lightThemeButton = document.querySelector('#light-theme-button')
const darkThemeButton = document.querySelector('#dark-theme-button')

// Class-changing items
const bodyEl = document.body
const headerEl = document.querySelector('header')
const taskListEl = document.querySelector('#task-list')
const groupingMobileEl = document.querySelector('#grouping-mobile')

const taskNameInput = document.querySelector('#task-name-input')
const taskListFooterMobileEl = document.querySelector(
  '#task-list-footer-mobile'
)
const taskListFooterDesktop = document.querySelector(
  '#task-list-footer-desktop'
)
const groupingEls = document.querySelectorAll('.grouping')
const clearCompletedButtonEls = document.querySelectorAll(
  '.clear-completed-button'
)

let tasks = []
let filter = 'All'

function setLightTheme() {
  bodyEl.classList.add('body-light')
  bodyEl.classList.remove('body-dark')

  lightThemeButton.classList.add('hide')
  darkThemeButton.classList.remove('hide')

  headerEl.classList.add('header-light')
  headerEl.classList.remove('header-dark')

  taskListEl.classList.add('task-list-light')
  taskListEl.classList.remove('task-list-dark')

  groupingMobileEl.classList.add('grouping-mobile-light')
  groupingMobileEl.classList.remove('grouping-mobile-dark')
}

function setDarkTheme() {
  bodyEl.classList.add('body-dark')
  bodyEl.classList.remove('body-light')

  darkThemeButton.classList.add('hide')
  lightThemeButton.classList.remove('hide')

  headerEl.classList.add('header-dark')
  headerEl.classList.remove('header-light')

  taskListEl.classList.add('task-list-dark')
  taskListEl.classList.remove('task-list-light')

  groupingMobileEl.classList.add('grouping-mobile-dark')
  groupingMobileEl.classList.remove('grouping-mobile-light')
}

// creates a unique ID
function makeid(length) {
  var result = ''
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function addTask() {
  let name = taskNameInput.value
  if (!name) return
  let id = makeid(10)
  let taskObject = {
    name: name,
    status: 'new',
    id: id
  }
  tasks.push(taskObject)

  renderTasks()

  taskNameInput.value = ''
}

function deleteTask(id) {
  tasks.forEach((task, index) => {
    if (task.id === id) {
      tasks.splice(index, 1)
    }
  })
  renderTasks()
}

function toggleTaskStatus(id) {
  let taskContainer
  tasks.forEach(task => {
    if (task.id === id) {
      taskContainer = task
    }
  })
  if (taskContainer.status === 'new') {
    taskContainer.status = 'done'
  } else {
    taskContainer.status = 'new'
  }
  renderTasks()
}
function allowDrop(ev) {
  ev.preventDefault()
}

function dragStart(e) {
  this.style.opacity = '0.4'
  dragSrcEl = this
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('text/html', this.innerHTML)
  e.dataTransfer.setData('source', this.className)
}

function dragDrop(e) {
  if (dragSrcEl !== this) {
    dragSrcEl.innerHTML = this.innerHTML
    dragSrcEl.className = this.className
    this.innerHTML = e.dataTransfer.getData('text/html')
    this.className = e.dataTransfer.getData('source')
  }
  return false
}

function drag(ev) {
  ev.dataTransfer.setData('text', ev.target.id)
}

function dragEnd(e) {
  this.style.opacity = '1'
  let allTaskEls = Array.from(taskListEl.querySelectorAll('.task'))

  const allTasks = []
  allTaskEls.forEach(taskEl => {
    console.log(taskEl.textContent)
    let attributes = Array.from(taskEl.attributes)
    let index = attributes.findIndex(att => att.name === 'data')
    let status
    if(taskEl.classList.contains('done-task')) {
      status = 'done'
    } else {
      status = 'new'
    }
    allTasks.push({
      name: taskEl.textContent,
      id: attributes[index],
      status: status
    })
  })
  tasks = allTasks
  renderTasks()
}

function createTaskElement(name, id) {
  const taskEl = document.createElement('li')
  const checkboxEl = document.createElement('span')
  const nameEl = document.createElement('p')
  const deleteButton = document.createElement('img')

  taskEl.classList.add('task')

  taskEl.setAttribute('draggable', 'true')
  taskEl.setAttribute('ondragStart', 'drag(event)')
  taskEl.setAttribute('data', id)
  taskEl.addEventListener('drop', dragDrop, false)
  taskEl.addEventListener('dragstart', dragStart, false)
  taskEl.addEventListener('dragend', dragEnd, false)

  checkboxEl.classList.add('checkbox')
  checkboxEl.addEventListener('click', () => {
    toggleTaskStatus(id)
  })

  nameEl.textContent = name

  deleteButton.classList.add('delete-task')
  deleteButton.setAttribute('src', './images/icon-cross.svg')
  deleteButton.setAttribute('alt', 'Delete')
  deleteButton.addEventListener('click', () => {
    deleteTask(id)
  })

  taskEl.appendChild(checkboxEl)
  taskEl.appendChild(nameEl)
  taskEl.appendChild(deleteButton)

  return taskEl
}

function clearCompletedTasks() {
  tasks.forEach((task, index) => {
    if (task.status === 'done') {
      tasks.splice(index, 1)
    }
  })
  renderTasks()
}

function createDoneTaskElement(name, id) {
  const taskEl = document.createElement('li')
  const checkboxEl = document.createElement('span')
  const checkboxCheck = document.createElement('img')
  const nameEl = document.createElement('p')
  const deleteButton = document.createElement('img')

  taskEl.classList.add('task')
  taskEl.classList.add('done-task')

  taskEl.setAttribute('draggable', 'true')
  taskEl.setAttribute('ondragStart', 'drag(event)')
  taskEl.setAttribute('data', id)
  taskEl.addEventListener('drop', dragDrop, false)
  taskEl.addEventListener('dragstart', dragStart, false)
  taskEl.addEventListener('dragend', dragEnd, false)

  checkboxEl.classList.add('checkbox-checked')
  checkboxEl.addEventListener('click', () => {
    toggleTaskStatus(id)
  })

  checkboxCheck.setAttribute('src', './images/icon-check.svg')
  checkboxCheck.setAttribute('alt', 'Uncheck')

  nameEl.textContent = name

  deleteButton.classList.add('delete-task')
  deleteButton.setAttribute('src', './images/icon-cross.svg')
  deleteButton.setAttribute('alt', 'Delete')
  deleteButton.addEventListener('click', () => {
    deleteTask(id)
  })

  checkboxEl.appendChild(checkboxCheck)

  taskEl.appendChild(checkboxEl)
  taskEl.appendChild(nameEl)
  taskEl.appendChild(deleteButton)

  return taskEl
}

function renderTasks() {
  clearTasksFromList()
  let taskCounter = 0
  tasks.forEach(task => {
    let taskEl
    if (task.status === 'new') {
      if (filter === 'All' || filter === 'Active') {
        taskEl = createTaskElement(task.name, task.id)
        taskCounter++
      }
    } else {
      if (filter === 'All' || filter === 'Completed') {
        taskEl = createDoneTaskElement(task.name, task.id)
      }
    }

    if (taskListFooterMobileEl && taskEl) {
      taskListEl.insertBefore(taskEl, taskListFooterMobileEl)

      taskListFooterMobileEl.querySelector('#items-left-mobile').textContent =
        taskCounter + ' items left'
      taskListFooterDesktop.querySelector('#items-left-desktop').textContent =
        taskCounter + ' items left'
    }
  })
}

function setFilter(groupEl) {
  const groupingAllMobileEl = document.querySelector('#grouping-all-mobile')
  const groupingActiveMobileEl = document.querySelector(
    '#grouping-active-mobile'
  )
  const groupingCompletedMobileEl = document.querySelector(
    '#grouping-completed-mobile'
  )

  const groupingAllDesktopEl = document.querySelector('#grouping-all-desktop')
  const groupingActiveDesktopEl = document.querySelector(
    '#grouping-active-desktop'
  )
  const groupingCompletedDesktopEl = document.querySelector(
    '#grouping-completed-desktop'
  )

  if (groupEl.textContent === 'All') {
    filter = 'All'
    groupingAllMobileEl.classList.add('grouping-active')
    groupingActiveMobileEl.classList.remove('grouping-active')
    groupingCompletedMobileEl.classList.remove('grouping-active')

    groupingAllDesktopEl.classList.add('grouping-active')
    groupingActiveDesktopEl.classList.remove('grouping-active')
    groupingCompletedDesktopEl.classList.remove('grouping-active')
  } else if (groupEl.textContent === 'Active') {
    filter = 'Active'
    groupingActiveMobileEl.classList.add('grouping-active')
    groupingAllMobileEl.classList.remove('grouping-active')
    groupingCompletedMobileEl.classList.remove('grouping-active')

    groupingActiveDesktopEl.classList.add('grouping-active')
    groupingAllDesktopEl.classList.remove('grouping-active')
    groupingCompletedDesktopEl.classList.remove('grouping-active')
  } else if (groupEl.textContent === 'Completed') {
    filter = 'Completed'
    groupingCompletedMobileEl.classList.add('grouping-active')
    groupingAllMobileEl.classList.remove('grouping-active')
    groupingActiveMobileEl.classList.remove('grouping-active')

    groupingCompletedDesktopEl.classList.add('grouping-active')
    groupingAllDesktopEl.classList.remove('grouping-active')
    groupingActiveDesktopEl.classList.remove('grouping-active')
  }
  renderTasks()
}

function clearTasksFromList() {
  let taskEls = Array.from(taskListEl.querySelectorAll('.task'))
  taskEls.forEach(taskEl => {
    taskEl.parentNode.removeChild(taskEl)
  })
}

// Setting two default tasks
taskNameInput.value = 'Clean'
addTask()
taskNameInput.value = 'Exercise'
addTask()

lightThemeButton.addEventListener('click', event => {
  setLightTheme()
})
darkThemeButton.addEventListener('click', event => {
  setDarkTheme()
})

taskNameInput.addEventListener('keyup', event => {
  if (event.key === 'Enter') addTask()
})

groupingEls.forEach(groupingEl => {
  groupingEl.addEventListener('click', event => {
    setFilter(event.target)
  })
})
clearCompletedButtonEls.forEach(clearCompletedButtonEl => {
  clearCompletedButtonEl.addEventListener('click', clearCompletedTasks)
})
