import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import store from "../../../store/store";
import { Provider } from "react-redux";
import Home from "../Home";

afterAll(() => {
  jest.clearAllMocks(); // Clears mocks after each test
});

// Mock Redux Store
describe("Home", () => {
  // mock data

  const addTodo = async (
    title: string,
    description: string,
    dueDate: string
  ) => {
    // Let's check the add todo button
    const addTodoButton = screen.getByRole("button", { name: "Add" });
    expect(addTodoButton).toBeInTheDocument();

    // Let's click the button, it should show up a form dialog
    fireEvent.click(addTodoButton);

    // We should see the form dialog
    const formDialog = screen.getByRole("dialog", { name: "Add Todo" });
    expect(formDialog).toBeInTheDocument();

    // Get all the input fields
    const titleInput = screen.getByRole("textbox", { name: "Title" });
    const descriptionInput = screen.getByRole("textbox", {
      name: "Description",
    });
    const dueDateInput = screen.getByLabelText(/due date/i);
    const submitButton = screen.getByRole("button", { name: "Submit" });

    // Now let's add a todo
    fireEvent.change(titleInput, { target: { value: title } });
    fireEvent.change(descriptionInput, {
      target: { value: description },
    });
    fireEvent.change(dueDateInput, { target: { value: dueDate } });

    // Check if the input value are correct
    expect(titleInput).toHaveValue(title);
    expect(descriptionInput).toHaveValue(description);
    expect(dueDateInput).toHaveValue(dueDate);

    // Let's submit the form, it should add the new todo
    fireEvent.click(submitButton);

    // Once added successfully, it will automatically close the model
    await waitFor(() => {
      expect(formDialog).not.toBeInTheDocument();
    });
  };

  const renderWithStore = (ui: JSX.Element, customStore = store) => {
    return render(<Provider store={customStore}>{ui}</Provider>);
  };

  beforeEach(() => {
    renderWithStore(<Home />);
  });
  it("Should render the Todo List Page", () => {
    const pageTitle = screen.getByText(/My Todo List/i);
    expect(pageTitle).toBeInTheDocument();
  });

  it("Should inform the user that there are no todos", () => {
    // Initially Our todos are empty
    const noTodos = screen.getByText(/No todos found/i);
    expect(noTodos).toBeInTheDocument();
  });

  it("Should have an add button that can add a todo", async () => {
    // Using our addTodo Function let's add a todo
    const title = "New Todo List";
    const description = "my description";
    const date = "2024-01-01";
    await addTodo(title, description, date);

    // Now that the dialog is closed, we should see the new todo on the list
    const todoItem = screen.getByTestId(`todo-0-${title}`);
    const todoList = screen.getByTestId("todo-list");
    expect(todoItem).toBeInTheDocument();
    expect(todoList.childElementCount).toBe(1);
  });

  it("Should have an edit button inside of the todo", async () => {
    // Let's get the todo from that we created from the previous test
    await waitFor(() =>
      expect(
        screen.getByTestId(`todo-0-${"New Todo List"}`)
      ).toBeInTheDocument()
    );
    const todoItem = screen.getByTestId(`todo-0-${"New Todo List"}`);

    // Let's click the more options button to show the edit button
    const moreOptionButton = within(todoItem).getByRole("button"); // Since we are inside the todo item, we don't to use the 'name' attribute
    expect(moreOptionButton).toBeInTheDocument();
    fireEvent.click(moreOptionButton);

    // Let's click the edit button
    const editButton = screen.getByRole("button", { name: /edit/i });
    expect(editButton).toBeInTheDocument();
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(editButton).not.toBeInTheDocument();
    });

    // Let's edit the todo
    const applyBtn = await screen.findByRole("button", { name: "Apply" });
    expect(applyBtn).toBeInTheDocument();
    const titleInput = screen.getByRole("textbox", { name: "Title" });
    const descriptionInput = screen.getByRole("textbox", {
      name: "Description",
    });
    const dueDateInput = screen.getByLabelText(/due date/i);

    // Now let's change the details
    fireEvent.change(titleInput, { target: { value: "Edited Title" } });
    fireEvent.change(descriptionInput, {
      target: { value: "Edited Description" },
    });
    fireEvent.change(dueDateInput, { target: { value: "2023-01-02" } });

    // Check if the input value are correct
    expect(titleInput).toHaveValue("Edited Title");
    expect(descriptionInput).toHaveValue("Edited Description");
    expect(dueDateInput).toHaveValue("2023-01-02");

    // Let's apply the changes
    fireEvent.click(applyBtn);

    // Now that the dialog is closed, we should see the new todo on the list
    const newTodo = screen.getByTestId(`todo-0-Edited Title`);
    expect(newTodo).toBeInTheDocument();
  });

  it("Should be able to change the status inside of todo", async () => {
    await waitFor(() =>
      expect(screen.getByTestId(`todo-0-${"Edited Title"}`)).toBeInTheDocument()
    );
    const todoItem = screen.getByTestId(`todo-0-${"Edited Title"}`);

    // Let's get the select input
    const statusSelector = within(todoItem).getByRole("textbox", {
      hidden: true,
    });

    // By default the value of newly created todo should be pending
    expect(statusSelector).toBeInTheDocument();
    expect(statusSelector).toHaveValue("pending");

    // Let's change the status to completed
    fireEvent.change(statusSelector, { target: { value: "in progress" } });
    await waitFor(() => {
      expect(statusSelector).toHaveValue("in progress");
    });
  });

  it("Should be able to search for a todo", async () => {
    // Let's initialize our search input
    const searchInput = screen.getByTestId("search-input");
    expect(searchInput).toBeInTheDocument();
    const textBox = within(searchInput).getByRole("textbox");
    expect(textBox).toBeInTheDocument();

    // Before we search for a todo, let's get the todo list
    const todoList = screen.getByTestId("todo-list");
    expect(todoList.childElementCount).toBe(1);

    // Let's search for a todo, since we already edited our todo from the previous test we should't able to see the previous title that
    // we declare on the constant variable at the top
    fireEvent.change(textBox, { target: { value: "New Todo List" } });
    await waitFor(() => {
      expect(
        screen.getByText("No todos matched your search keyword.")
      ).toBeInTheDocument();
    });
    expect(todoList.childElementCount).toBe(0);

    // Now let's search for the edited title
    fireEvent.change(textBox, { target: { value: "Edited Title" } });
    await waitFor(() => {
      expect(screen.getByTestId(`todo-0-Edited Title`)).toBeInTheDocument();
    });
    expect(todoList.childElementCount).toBe(1);
  });

  it("Should be able to filter the todo list by status", async () => {
    // Let's initialize our search input
    const comboBox = screen.getByTestId("status-filter");
    expect(comboBox).toBeInTheDocument();
    const textBox = within(comboBox).getByRole("textbox", { hidden: true });
    expect(textBox).toBeInTheDocument();

    // By default the filter is set to all
    expect(textBox).toHaveValue("all");

    // Now to check if it's really working let's add a new to do to have move samples
    const todoList = screen.getByTestId("todo-list");
    expect(todoList.childElementCount).toBe(1);
    await addTodo("Demo Project", "Demo todo project", "2024-01-03");
    expect(todoList.childElementCount).toBe(2);

    // Now that we have to todos, we can now check our filter
    // Since the newly created todo status is set to pending and our first to do status is updated to in progress we can test
    // each status if the filter is working
    // for the first test, let's set the filter to "in progress"
    // Use regex to find all todo items
    fireEvent.change(textBox, { target: { value: "in progress" } });
    expect(todoList.childElementCount).toBe(1);
    expect(screen.queryByText(/edited title/i));

    // let's try pending
    fireEvent.change(textBox, { target: { value: "pending" } });
    expect(todoList.childElementCount).toBe(1);
    expect(screen.queryByText(/Demo Project/i));

    // let's try completed which we don't have in our list of todos
    fireEvent.change(textBox, { target: { value: "completed" } });
    expect(todoList.childElementCount).toBe(0);
  });

  it("Should be able to delete a todo", async () => {
    await waitFor(() => {
      expect(screen.getByTestId(`todo-0-Edited Title`)).toBeInTheDocument();
    });
    const todoItem = screen.getByTestId(`todo-0-Edited Title`);
    const todoList = screen.getByTestId("todo-list");

    expect(todoItem).toBeInTheDocument();
    expect(todoList.childElementCount).toBe(2);

    // Let's click the more options button to show the edit button
    const moreOptionButton = within(todoItem).getByRole("button"); // Since we are inside the todo item, we don't to use the 'name' attribute
    expect(moreOptionButton).toBeInTheDocument();
    fireEvent.click(moreOptionButton);

    // Let's click the edit button
    const deleteButton = screen.getByRole("button", { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(todoList.childElementCount).toBe(1);
    });
  });
});
