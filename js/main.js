new Vue({
  el: "#app",
  data: {
    newTask: "",
    taskDuration: "moins-de-deux-minutes",
    tasks: {
      todoNow: [],
      todoLater: [],
    },
    notFeasibleTasks: [],
    archivedTasks: [],
    doneTasks: [],
  },
  mounted() {
    const savedData = localStorage.getItem("gtdAppData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      Object.assign(this.$data, parsedData);
    }
  },
  watch: {
    $data: {
      deep: true,
      handler: "saveData",
    },
  },
  methods: {
    addTask() {
      if (this.newTask.trim() !== "") {
        const task = {
          text: this.newTask.trim(),
          duration: this.taskDuration,
          dueDate: null,
          done: false,
        };

        if (this.taskDuration === "moins-de-deux-minutes") {
          task.done = true;
          this.tasks.todoNow.push(task);
        } else if (this.taskDuration === "plus-de-deux-minutes") {
          this.tasks.todoLater.push(task);
        } else if (this.taskDuration === "hors-competences") {
          this.notFeasibleTasks.push(task);
        }

        this.newTask = "";
      }
    },
    updateTaskDuration() {
      this.addTask();
    },
    removeTask(index, listType) {
      if (listType === "not-feasible") {
        this.notFeasibleTasks.splice(index, 1);
      } else if (listType === "todoLater") {
        const task = this.tasks.todoLater[index];
        if (task.duration === "plus-de-deux-minutes") {
          const dueDate = prompt("Veuillez saisir une nouvelle date pour cette tâche (AAAA-MM-JJ) :");
          if (dueDate) {
            this.tasks.todoLater[index].dueDate = dueDate;
          }
        }
      }
    },
    updateDueDate(task, index) {
      const dueDate = prompt("Veuillez saisir une nouvelle date pour cette tâche (AAAA-MM-JJ) :");
      if (dueDate) {
        this.tasks.todoLater[index].dueDate = dueDate;
      }
    },
    archiveTask(index, list) {
      const taskToArchive = this[list][index];
      const currentDate = new Date();
      const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
      const archivedTask = {
        text: taskToArchive.text,
        date: formattedDate,
      };
      this.archivedTasks.push(archivedTask);
      this[list].splice(index, 1);
    },
    deleteArchivedTask(index) {
      this.archivedTasks.splice(index, 1);
    },
    markTaskAsDone(index, list) {
      const taskToMove = this.tasks[list][index];
      taskToMove.done = true;
      this.doneTasks.push(taskToMove);
      this.tasks[list].splice(index, 1);
    },
    saveData() {
      const dataToSave = {
        newTask: this.newTask,
        taskDuration: this.taskDuration,
        tasks: this.tasks,
        notFeasibleTasks: this.notFeasibleTasks,
        archivedTasks: this.archivedTasks,
        doneTasks: this.doneTasks,
      };

      localStorage.setItem("gtdAppData", JSON.stringify(dataToSave));
    },
  },
});
