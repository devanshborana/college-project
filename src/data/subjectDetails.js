// Subject-specific details: syllabus topics + coding problems per subject

export const subjectDetails = {

  'dsa': {
    topics: [
      'Arrays, Strings & Matrices', 'Linked Lists (Singly, Doubly, Circular)',
      'Stacks and Queues', 'Trees: BST, AVL, Heaps',
      'Graphs: BFS, DFS, Dijkstra', 'Sorting: Bubble, Merge, Quick, Heap',
      'Searching: Linear, Binary', 'Hashing & Hash Tables',
      'Dynamic Programming', 'Greedy Algorithms',
    ],
    codingProblems: [
      {
        id: 'dsa-1', title: 'Bubble Sort', difficulty: 'Easy',
        objective: 'Write a C program to sort an array of n integers using the Bubble Sort algorithm.',
        requirements: [
          'Take a hardcoded array of integers.',
          'Implement the Bubble Sort logic (compare adjacent elements and swap if they are in the wrong order).',
          'Print the array before and after sorting.'
        ],
        expectedOutput: `Before: 64 34 25 12 22 11 90 
After:  11 12 22 25 34 64 90 `,
        starterCode: `#include <stdio.h>

void bubbleSort(int arr[], int n) {
    // TODO: implement bubble sort
}

int main() {
    int arr[] = {64, 34, 25, 12, 22, 11, 90};
    int n = 7;
    printf("Before: ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    bubbleSort(arr, n);
    printf("\\nAfter:  ");
    for (int i = 0; i < n; i++) printf("%d ", arr[i]);
    return 0;
}`,
      },
      {
        id: 'dsa-2', title: 'Binary Search', difficulty: 'Easy',
        objective: 'Implement binary search in C to find the index of a target value in a sorted array.',
        requirements: [
          'Take a hardcoded sorted array of integers.',
          'Write a function binarySearch(arr, n, target) that returns the index of the target.',
          'If the target is not found, return -1.'
        ],
        expectedOutput: `Index of 23: 5
Index of 50: -1`,
        starterCode: `#include <stdio.h>

int binarySearch(int arr[], int n, int target) {
    // TODO: implement binary search
    return -1;
}

int main() {
    int arr[] = {2, 5, 8, 12, 16, 23, 38, 56, 72, 91};
    int n = 10;
    printf("Index of 23: %d\\n", binarySearch(arr, n, 23));
    printf("Index of 50: %d\\n", binarySearch(arr, n, 50));
    return 0;
}`,
      },
      {
        id: 'dsa-3', title: 'Reverse a Linked List', difficulty: 'Medium',
        objective: 'Create a singly linked list and write a function to reverse it in-place.',
        requirements: [
          'Define a Node structure with data and a next pointer.',
          'Create a linked list 1 -> 2 -> 3 -> 4 -> 5.',
          'Write a reverse() function that changes the pointers to reverse the list.',
          'Print the list before and after reversal.'
        ],
        expectedOutput: `Before: 1 -> 2 -> 3 -> 4 -> 5 -> NULL
After:  5 -> 4 -> 3 -> 2 -> 1 -> NULL`,
        starterCode: `#include <stdio.h>
#include <stdlib.h>

struct Node { int data; struct Node* next; };

struct Node* reverse(struct Node* head) {
    // TODO: reverse the linked list in-place
    return head;
}

void printList(struct Node* head) {
    while (head) { printf("%d -> ", head->data); head = head->next; }
    printf("NULL\\n");
}

int main() {
    // Create: 1 -> 2 -> 3 -> 4 -> 5
    struct Node* head = NULL;
    for (int i = 5; i >= 1; i--) {
        struct Node* n = malloc(sizeof(struct Node));
        n->data = i; n->next = head; head = n;
    }
    printf("Before: "); printList(head);
    head = reverse(head);
    printf("After:  "); printList(head);
    return 0;
}`,
      },
      {
        id: 'dsa-4', title: 'Stack using Array', difficulty: 'Easy',
        objective: 'Implement a stack data structure using an array in C.',
        requirements: [
          'Use a global array and a top variable initialized to -1.',
          'Implement push(x) to add an element.',
          'Implement pop() to remove and return the top element.',
          'Implement peek() to return the top element without removing it.',
          'Implement isEmpty() to check if the stack is empty.'
        ],
        expectedOutput: `Top: 30
Pop: 30
Pop: 20
Empty? 0`,
        starterCode: `#include <stdio.h>
#define MAX 100

int stack[MAX], top = -1;

void push(int x) { /* TODO */ }
int pop()        { /* TODO: return -1 if empty */ return -1; }
int peek()       { /* TODO: return top element */ return -1; }
int isEmpty()    { return top == -1; }

int main() {
    push(10); push(20); push(30);
    printf("Top: %d\\n", peek());
    printf("Pop: %d\\n", pop());
    printf("Pop: %d\\n", pop());
    printf("Empty? %d\\n", isEmpty());
    return 0;
}`,
      },
      {
        id: 'dsa-5', title: 'Factorial (Recursion)', difficulty: 'Easy',
        objective: 'Write a recursive C function to compute the factorial of a number n.',
        requirements: [
          'The function should call itself to calculate n * factorial(n - 1).',
          'Define the base case where factorial of 0 or 1 is 1.',
          'Use long long to prevent integer overflow for larger factorials.',
          'Print the factorials of numbers from 1 to 10.'
        ],
        expectedOutput: ` 1! = 1
 2! = 2
 3! = 6
 ...
10! = 3628800`,
        starterCode: `#include <stdio.h>

long long factorial(int n) {
    // TODO: implement recursively
    return 0;
}

int main() {
    for (int i = 1; i <= 10; i++)
        printf("%2d! = %lld\\n", i, factorial(i));
    return 0;
}`,
      },
    ],
  },

  'oop': {
    topics: [
      'Classes & Objects', 'Constructors & Destructors',
      'Encapsulation & Access Specifiers', 'Inheritance (Single, Multiple, Multilevel)',
      'Polymorphism (Compile-time & Runtime)', 'Virtual Functions & Abstract Classes',
      'Operator Overloading', 'Templates (Function & Class)',
      'Exception Handling', 'STL: Vectors, Maps, Sets',
    ],
    codingProblems: [
      {
        id: 'oop-1', title: 'Bank Account Class', difficulty: 'Easy',
        objective: 'Create a C++ class BankAccount to simulate basic banking operations.',
        requirements: [
          'Include private member variables for balance and owner name.',
          'Create a constructor to initialize the account.',
          'Implement a deposit() method to add funds.',
          'Implement a withdraw() method that prevents withdrawals exceeding the balance and returns true/false.',
          'Implement a display() method to show the owner and balance.'
        ],
        expectedOutput: `Devansh: Rs.5000
Devansh: Rs.7000
Withdraw 3000: OK
Withdraw 9000: Failed
Devansh: Rs.4000`,
        starterCode: `#include <iostream>
using namespace std;

class BankAccount {
private:
    double balance;
    string owner;
public:
    BankAccount(string name, double initial) {
        // TODO: initialize
    }
    void deposit(double amount) { /* TODO */ }
    bool withdraw(double amount) { /* TODO: return false if insufficient */ return false; }
    double getBalance() { return balance; }
    void display() { cout << owner << ": Rs." << balance << endl; }
};

int main() {
    BankAccount acc("Devansh", 5000);
    acc.deposit(2000);
    acc.display();
    cout << "Withdraw 3000: " << (acc.withdraw(3000) ? "OK" : "Failed") << endl;
    cout << "Withdraw 9000: " << (acc.withdraw(9000) ? "OK" : "Failed") << endl;
    acc.display();
}`,
      },
      {
        id: 'oop-2', title: 'Shape Hierarchy (Virtual)', difficulty: 'Medium',
        objective: 'Demonstrate polymorphism using an abstract base class and virtual functions.',
        requirements: [
          'Create an abstract base class Shape with a pure virtual area() method and a pure virtual name() method.',
          'Derive a Circle class from Shape that calculates area as π * r * r.',
          'Derive a Rectangle class from Shape that calculates area as width * height.',
          'Create an array of Shape pointers pointing to Circle and Rectangle objects and call their printArea() method.'
        ],
        expectedOutput: `Circle area = 78.5398
Rectangle area = 24`,
        starterCode: `#include <iostream>
#include <cmath>
using namespace std;

class Shape {
public:
    virtual double area() = 0;  // pure virtual
    virtual string name() = 0;
    void printArea() {
        cout << name() << " area = " << area() << endl;
    }
};

class Circle : public Shape {
    double r;
public:
    Circle(double radius) : r(radius) {}
    // TODO: implement area() and name()
};


public:
    Rectangle(double width, double height) : w(width), h(height) {}
    // TODO: implement area() and name()
};

int main() {
    Shape* shapes[] = { new Circle(5), new Rectangle(4, 6) };
    for (auto s : shapes) s->printArea();
}`,
      },
      {
        id: 'oop-3', title: 'Operator Overloading (Complex)', difficulty: 'Medium',
        objective: 'Overload operators in C++ to perform arithmetic on complex numbers.',
        requirements: [
          'Create a Complex class with real and imaginary parts.',
          'Overload the + operator to add two complex numbers.',
          'Overload the - operator to subtract two complex numbers.',
          'Overload the << operator to print the complex number in the format "a + bi" or "a - bi".'
        ],
        expectedOutput: `a = 3 + 4i
b = 1 - 2i
a+b = 4 + 2i
a-b = 2 + 6i`,
        starterCode: `#include <iostream>
using namespace std;

class Complex {
public:
    double real, imag;
    Complex(double r = 0, double i = 0) : real(r), imag(i) {}

    Complex operator+(const Complex& other) {
        // TODO: return sum
        return Complex();
    }
    Complex operator-(const Complex& other) {
        // TODO: return difference
        return Complex();
    }
    friend ostream& operator<<(ostream& os, const Complex& c) {
        // TODO: print as "a + bi"
        return os;
    }
};

int main() {
    Complex a(3, 4), b(1, -2);
    cout << "a = " << a << endl;
    cout << "b = " << b << endl;
    cout << "a+b = " << a+b << endl;
    cout << "a-b = " << a-b << endl;
}`,
      },
      {
        id: 'oop-4', title: 'Template Max Function', difficulty: 'Easy',
        objective: 'Write a C++ template function findMax() that works with multiple data types.',
        requirements: [
          'Define a template function findMax(a, b) that returns the larger of the two arguments.',
          'Test the function with integers (10, 20).',
          'Test the function with floats (3.14, 2.71).',
          'Test the function with characters (\'z\', \'a\').'
        ],
        expectedOutput: `20
3.14
z`,
        starterCode: `#include <iostream>
using namespace std;

template <typename T>
T findMax(T a, T b) {
    // TODO: return the larger value
}

int main() {
    cout << findMax(10, 20) << endl;
    cout << findMax(3.14, 2.71) << endl;
    cout << findMax('z', 'a') << endl;
}`,
      },
      {
        id: 'oop-5', title: 'Student Class with Inheritance', difficulty: 'Medium',
        objective: 'Demonstrate inheritance and method overriding in C++.',
        requirements: [
          'Create a Person base class with protected name and age, and a virtual display() method.',
          'Create a Student derived class that adds a student ID and GPA.',
          'Override the display() method in the Student class to call the base class display() and then print the ID and GPA.',
          'Create a Student object using a Person pointer and call display().'
        ],
        expectedOutput: `Name: Devansh, Age: 20
ID: LMCST-001, GPA: 8.7`,
        starterCode: `#include <iostream>
using namespace std;

class Person {
protected:
    string name;
    int age;
public:
    Person(string n, int a) : name(n), age(a) {}
    virtual void display() {
        cout << "Name: " << name << ", Age: " << age << endl;
    }
};

class Student : public Person {
    string id;
    double gpa;
public:
    Student(string n, int a, string sid, double g)
        : Person(n, a), id(sid), gpa(g) {}
    void display() override {
        // TODO: call Person::display() and also print id and gpa
    }
};

int main() {
    Person* p = new Student("Devansh", 20, "LMCST-001", 8.7);
    p->display();
}`,
      },
    ],
  },

  'web-tech': {
    topics: [
      'HTML5 Structure & Semantic Tags', 'CSS3: Box Model, Flexbox, Grid',
      'CSS Animations & Transitions', 'JavaScript ES6+ Basics',
      'DOM Manipulation & Events', 'Fetch API & AJAX',
      'Responsive Design & Media Queries', 'Forms & Validation',
      'Local Storage & Session Storage', 'Introduction to React / Vue',
    ],
    codingProblems: [
      {
        id: 'web-1', title: 'Responsive Card Layout', difficulty: 'Easy',
        description: 'Create 3 responsive profile cards using HTML & CSS Flexbox. Each card should have an avatar circle, name, role, and a button.',
        starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Profile Cards</title>
  <style>
    body { font-family: sans-serif; background: #f5f3ff; margin: 0; padding: 20px; }
    .cards-container {
      /* TODO: use flexbox to arrange cards in a row, wrapping on small screens */
    }
    .card {
      /* TODO: style the card with shadow, rounded corners, white bg */
    }
    /* Add more styles... */
  </style>
</head>
<body>
  <div class="cards-container">
    <div class="card">
      <div class="avatar">DB</div>
      <h3>Devansh Borana</h3>
      <p>CSE Student</p>
      <button>View Profile</button>
    </div>
    <!-- Add 2 more cards -->
  </div>
</body>
</html>`,
      },
      {
        id: 'web-2', title: 'JS Todo List', difficulty: 'Easy',
        description: 'Build a fully functional todo list using HTML, CSS, and JavaScript. Support add, delete, and mark-complete for tasks.',
        starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Todo List</title>
  <style>
    body { font-family: sans-serif; max-width: 500px; margin: 40px auto; padding: 0 20px; }
    /* TODO: add styles for input, button, list items */
  </style>
</head>
<body>
  <h2>📝 My Todo List</h2>
  <div style="display:flex; gap:8px;">
    <input id="taskInput" type="text" placeholder="Add a new task..." />
    <button onclick="addTask()">Add</button>
  </div>
  <ul id="taskList"></ul>

  <script>
    function addTask() {
      // TODO: get input value, create li element, add to list
    }
    function deleteTask(btn) {
      // TODO: remove the parent li from the list
    }
    function toggleTask(li) {
      // TODO: toggle strikethrough style on the li
    }
  </script>
</body>
</html>`,
      },
      {
        id: 'web-3', title: 'Form Validation', difficulty: 'Medium',
        description: 'Create a registration form with name, email, password, and confirm password fields. Validate using JavaScript before submission.',
        starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Registration Form</title>
  <style>
    body { font-family: sans-serif; max-width: 400px; margin: 40px auto; }
    .error { color: red; font-size: 12px; display: none; }
    input { display: block; width: 100%; margin: 8px 0 4px; padding: 8px; box-sizing: border-box; }
  </style>
</head>
<body>
  <h2>Register</h2>
  <form id="regForm" onsubmit="validate(event)">
    <label>Full Name</label>
    <input type="text" id="name" placeholder="John Doe">
    <span class="error" id="nameErr">Name must be at least 3 characters</span>

    <label>Email</label>
    <input type="email" id="email" placeholder="john@example.com">
    <span class="error" id="emailErr">Invalid email address</span>

    <label>Password</label>
    <input type="password" id="pass" placeholder="Min 6 characters">
    <span class="error" id="passErr">Password too short</span>

    <label>Confirm Password</label>
    <input type="password" id="confirm" placeholder="Repeat password">
    <span class="error" id="confirmErr">Passwords do not match</span>

    <button type="submit">Register</button>
  </form>
  <script>
    function validate(e) {
      e.preventDefault();
      // TODO: validate each field, show/hide error spans, show success alert if all valid
    }
  </script>
</body>
</html>`,
      },
      {
        id: 'web-4', title: 'Fetch API — User Cards', difficulty: 'Medium',
        description: 'Use the Fetch API to load users from https://jsonplaceholder.typicode.com/users and display them as cards on the page.',
        starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>API Users</title>
  <style>
    body { font-family: sans-serif; padding: 20px; background: #f0f4ff; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
    .card { background: white; padding: 16px; border-radius: 10px; box-shadow: 0 2px 8px #0001; }
  </style>
</head>
<body>
  <h2>👥 Users from API</h2>
  <div id="grid" class="grid">Loading...</div>
  <script>
    async function loadUsers() {
      // TODO: fetch from https://jsonplaceholder.typicode.com/users
      // For each user, create a card with name, email, and city
    }
    loadUsers();
  </script>
</body>
</html>`,
      },
      {
        id: 'web-5', title: 'CSS Animated Button', difficulty: 'Easy',
        description: 'Create 3 stylish animated CSS buttons: a gradient button, a neon glow button, and a ripple effect button.',
        starterCode: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>CSS Buttons</title>
  <style>
    body { display: flex; gap: 24px; align-items: center; justify-content: center; min-height: 100vh; background: #1e1b4b; flex-wrap: wrap; }

    /* TODO: Style 3 buttons */
    .btn-gradient {
      /* gradient background, hover scale effect */
    }
    .btn-neon {
      /* dark background, glowing box-shadow, border */
    }
    .btn-ripple {
      /* ripple effect using ::after pseudo-element */
    }
  </style>
</head>
<body>
  <button class="btn-gradient">Gradient</button>
  <button class="btn-neon">Neon Glow</button>
  <button class="btn-ripple">Ripple</button>
</body>
</html>`,
      },
    ],
  },

  'discrete-math': {
    topics: [
      'Propositional Logic & Truth Tables', 'Predicate Logic & Quantifiers',
      'Set Theory & Operations', 'Relations & Functions',
      'Counting: Permutations & Combinations', 'Mathematical Induction',
      'Graph Theory: Paths, Cycles, Trees', 'Graph Coloring & Planarity',
      'Boolean Algebra', 'Recurrence Relations',
    ],
    codingProblems: [
      { id: 'dm-1', title: 'Truth Table Generator', difficulty: 'Easy',
        description: 'Write a Python program to generate a truth table for the expression: p AND (q OR NOT r).',
        starterCode: `# Generate truth table for: p AND (q OR NOT r)
print(f"{'p':<5} {'q':<5} {'r':<5} {'p AND (q OR NOT r)'}")
print("-" * 30)
for p in [True, False]:
    for q in [True, False]:
        for r in [True, False]:
            result = # TODO: compute the expression
            print(f"{str(p):<5} {str(q):<5} {str(r):<5} {result}")` },
      { id: 'dm-2', title: 'Fibonacci via Induction', difficulty: 'Easy',
        description: 'Print the first 20 Fibonacci numbers using a loop. Then verify that fib(n) = fib(n-1) + fib(n-2) holds for all of them.',
        starterCode: `def fibonacci(n):
    # TODO: return list of first n fibonacci numbers
    pass

fibs = fibonacci(20)
print("Fibonacci sequence:", fibs)

# Verify the property for indices 2 to 19
for i in range(2, 20):
    assert fibs[i] == fibs[i-1] + fibs[i-2], f"Failed at index {i}"
print("Property verified for all indices!")` },
      { id: 'dm-3', title: 'Set Operations', difficulty: 'Easy',
        description: 'Given two sets A and B, compute: union, intersection, difference (A-B), symmetric difference, and check subset.',
        starterCode: `A = {1, 3, 5, 7, 9, 11}
B = {1, 2, 3, 4, 5}

# TODO: compute each operation and print results
print("A:", A)
print("B:", B)
print("A ∪ B:", )   # union
print("A ∩ B:", )   # intersection
print("A - B:", )   # difference
print("A △ B:", )   # symmetric difference
print("B ⊆ A:", )   # is B a subset of A?` },
      { id: 'dm-4', title: 'Graph BFS', difficulty: 'Medium',
        description: 'Implement Breadth-First Search (BFS) on an adjacency list graph in Python. Print the order of nodes visited.',
        starterCode: `from collections import deque

graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'], 'E': ['B', 'F'], 'F': ['C', 'E']
}

def bfs(graph, start):
    visited = []
    queue = deque([start])
    seen = {start}
    # TODO: implement BFS
    return visited

print("BFS from A:", bfs(graph, 'A'))` },
      { id: 'dm-5', title: 'Permutations & Combinations', difficulty: 'Easy',
        description: 'Without using itertools, write functions to compute nPr (permutations) and nCr (combinations). Print a table for n=1 to 6.',
        starterCode: `def factorial(n):
    # TODO
    pass

def nPr(n, r):
    # TODO: n! / (n-r)!
    pass

def nCr(n, r):
    # TODO: n! / (r! * (n-r)!)
    pass

print("n  r  nPr   nCr")
for n in range(1, 7):
    for r in range(0, n+1):
        print(f"{n}  {r}  {nPr(n,r):<6} {nCr(n,r)}")` },
    ],
  },

  'dbms': {
    topics: [
      'DBMS Concepts & Architecture', 'ER Diagrams & Data Modelling',
      'Relational Model & Relational Algebra', 'SQL: DDL, DML, DCL, TCL',
      'Joins, Subqueries & Views', 'Normalization: 1NF, 2NF, 3NF, BCNF',
      'Indexing & Query Optimization', 'Transactions & ACID Properties',
      'Concurrency Control', 'NoSQL Introduction',
    ],
    codingProblems: [
      { id: 'dbms-1', title: 'Student DB (Python dict)', difficulty: 'Easy',
        description: 'Simulate a student database using Python dictionaries. Support add, search by ID, delete, and list all operations.',
        starterCode: `students = {}

def add_student(sid, name, gpa):
    # TODO: add to dict
    pass

def get_student(sid):
    # TODO: return student or "Not Found"
    pass

def delete_student(sid):
    # TODO: remove from dict
    pass

def list_all():
    for sid, info in students.items():
        print(f"{sid}: {info}")

add_student("S001", "Devansh", 8.7)
add_student("S002", "Priya", 9.1)
print(get_student("S001"))
delete_student("S002")
list_all()` },
      { id: 'dbms-2', title: 'SQL: SELECT Queries', difficulty: 'Easy',
        description: 'Write the 5 SQL queries listed in the comments. Practice using WHERE, ORDER BY, GROUP BY, and HAVING clauses.',
        starterCode: `-- Imagine this table exists:
-- students(id, name, branch, gpa, year)

-- Q1: Find all students with GPA > 8.0
SELECT * FROM students WHERE gpa > 8.0;

-- Q2: Find average GPA per branch
-- TODO:

-- Q3: Find branch with more than 3 students
-- TODO:

-- Q4: List students sorted by GPA descending
-- TODO:

-- Q5: Find students whose name starts with 'A'
-- TODO:` },
      { id: 'dbms-3', title: 'Normalization Check', difficulty: 'Medium',
        description: 'Given a table with functional dependencies, identify if it is in 1NF, 2NF, and 3NF. Write Python code to validate each.',
        starterCode: `# Table: Order(OrderID, ProductID, ProductName, CustomerID, CustomerName, Qty)
# Functional Dependencies:
# OrderID, ProductID -> Qty
# ProductID -> ProductName
# CustomerID -> CustomerName
# OrderID -> CustomerID

# Check 1NF: All attributes must be atomic (single-valued)
# Check 2NF: No partial dependencies on composite key
# Check 3NF: No transitive dependencies

print("1NF Analysis:")
# TODO: check if any attribute has multi-valued entries

print("2NF Analysis:")
# TODO: identify partial dependencies (ProductID -> ProductName, OrderID -> CustomerID)

print("3NF Analysis:")
# TODO: identify transitive dependencies (OrderID -> CustomerID -> CustomerName)` },
      { id: 'dbms-4', title: 'Join Simulation', difficulty: 'Medium',
        description: 'Simulate INNER JOIN, LEFT JOIN, and FULL OUTER JOIN using Python lists of tuples without using any database library.',
        starterCode: `employees = [(1, "Alice", 10), (2, "Bob", 20), (3, "Charlie", 30)]
departments = [(10, "Engineering"), (20, "Marketing"), (40, "HR")]
# emp: (emp_id, name, dept_id)
# dept: (dept_id, dept_name)

def inner_join(emps, depts):
    # TODO: return rows where dept_id matches
    pass

def left_join(emps, depts):
    # TODO: return all employees, None for unmatched dept
    pass

print("INNER JOIN:")
for row in inner_join(employees, departments): print(row)

print("\\nLEFT JOIN:")
for row in left_join(employees, departments): print(row)` },
      { id: 'dbms-5', title: 'Index Simulation', difficulty: 'Medium',
        description: 'Simulate a simple hash index for a database table. Support insert and lookup by key. Compare search time with/without index.',
        starterCode: `import time, random

# Create a large list of records
records = [(i, f"Student_{i}", random.uniform(5.0, 10.0)) for i in range(10000)]

# Linear search (no index)
def linear_search(records, target_id):
    for rec in records:
        if rec[0] == target_id: return rec
    return None

# Build a hash index (dict: id -> record)
def build_index(records):
    # TODO: return a dict mapping id to record
    pass

# Index search
def index_search(index, target_id):
    # TODO: O(1) lookup
    pass

index = build_index(records)

target = 7532
t1 = time.time()
print("Linear:", linear_search(records, target))
print(f"Linear time: {time.time()-t1:.6f}s")

t2 = time.time()
print("Index: ", index_search(index, target))
print(f"Index time:  {time.time()-t2:.6f}s")` },
    ],
  },

  'computer-networks': {
    topics: [
      'OSI & TCP/IP Models', 'Physical Layer & Transmission Media',
      'Data Link Layer: Error & Flow Control', 'MAC Protocols & Ethernet',
      'Network Layer: IP Addressing & Subnetting', 'Routing Algorithms',
      'Transport Layer: TCP & UDP', 'Application Layer: HTTP, DNS, SMTP',
      'Network Security Basics', 'Wireless Networks & Wi-Fi',
    ],
    codingProblems: [
      { id: 'cn-1', title: 'Subnet Calculator', difficulty: 'Easy',
        description: 'Write a Python program to calculate network address, broadcast address, and valid host range given an IP and CIDR notation.',
        starterCode: `import ipaddress

def subnet_info(cidr):
    net = ipaddress.IPv4Network(cidr, strict=False)
    print(f"Network:   {net.network_address}")
    print(f"Broadcast: {net.broadcast_address}")
    print(f"Mask:      {net.netmask}")
    print(f"Hosts:     {net.num_addresses - 2}")
    # TODO: print first and last usable host addresses

subnet_info("192.168.1.0/24")
print()
subnet_info("10.0.0.0/8")` },
      { id: 'cn-2', title: 'HTTP Request Simulator', difficulty: 'Easy',
        description: 'Use Python requests to fetch data from a public API and display the response status, headers, and JSON body.',
        starterCode: `import requests

url = "https://jsonplaceholder.typicode.com/posts/1"

# TODO: make GET request, print:
# - Status code
# - Content-Type header
# - Response body (formatted JSON)

response = requests.get(url)
print("Status:", response.status_code)
# TODO: print headers and body` },
      { id: 'cn-3', title: 'Hamming Code (Error Detection)', difficulty: 'Medium',
        description: 'Implement Hamming code encoding for 4-bit data in Python. Add parity bits and verify error detection.',
        starterCode: `def hamming_encode(data_bits):
    # data_bits: list of 4 bits e.g. [1,0,1,1]
    # Positions: 1,2,3,4,5,6,7 (1-indexed)
    # Parity bits at positions: 1,2,4
    # Data bits at positions: 3,5,6,7
    d = data_bits
    # TODO: place data bits, calculate parity bits p1,p2,p4
    # p1 covers positions 1,3,5,7
    # p2 covers positions 2,3,6,7
    # p4 covers positions 4,5,6,7
    encoded = [0] * 7
    return encoded

data = [1, 0, 1, 1]
encoded = hamming_encode(data)
print("Data bits:", data)
print("Encoded:  ", encoded)` },
      { id: 'cn-4', title: 'DNS Lookup', difficulty: 'Easy',
        description: 'Write a Python program to perform DNS resolution — given a domain name, find its IP address, and vice versa.',
        starterCode: `import socket

def domain_to_ip(domain):
    # TODO: use socket.gethostbyname()
    pass

def ip_to_domain(ip):
    # TODO: use socket.gethostbyaddr()
    pass

domains = ["google.com", "github.com", "lachoomemorial.org"]
for d in domains:
    ip = domain_to_ip(d)
    print(f"{d} -> {ip}")` },
      { id: 'cn-5', title: 'Dijkstra\'s Shortest Path', difficulty: 'Hard',
        description: 'Implement Dijkstra\'s shortest path algorithm in Python for a weighted network graph.',
        starterCode: `import heapq

# Graph as adjacency list: {node: [(neighbor, weight), ...]}
graph = {
    'A': [('B', 4), ('C', 2)],
    'B': [('A', 4), ('D', 3), ('E', 1)],
    'C': [('A', 2), ('D', 5)],
    'D': [('B', 3), ('C', 5), ('E', 2)],
    'E': [('B', 1), ('D', 2)]
}

def dijkstra(graph, start):
    dist = {node: float('inf') for node in graph}
    dist[start] = 0
    heap = [(0, start)]
    # TODO: implement Dijkstra with min-heap
    return dist

distances = dijkstra(graph, 'A')
for node, d in sorted(distances.items()):
    print(f"A -> {node}: {d}")` },
    ],
  },

  'concepts-ai': {
    topics: [
      'Introduction to AI & Turing Test', 'Search Algorithms: BFS, DFS, A*',
      'Heuristic & Informed Search', 'Knowledge Representation',
      'Machine Learning Basics: Supervised & Unsupervised',
      'Linear & Logistic Regression', 'Decision Trees & Random Forests',
      'Neural Networks & Deep Learning Intro',
      'Natural Language Processing Basics', 'Computer Vision Introduction',
    ],
    codingProblems: [
      { id: 'ai-1', title: 'Linear Regression', difficulty: 'Easy',
        description: 'Implement linear regression from scratch using gradient descent. Find the best fit line for given (x, y) data points.',
        starterCode: `import numpy as np

# Training data: hours studied vs marks
X = np.array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
y = np.array([52, 58, 61, 68, 75, 78, 83, 89, 92, 97])

def linear_regression(X, y, lr=0.001, epochs=1000):
    m, b = 0, 0  # slope, intercept
    n = len(X)
    for _ in range(epochs):
        # TODO: compute predictions, loss, gradients, update m and b
        pass
    return m, b

m, b = linear_regression(X, y)
print(f"Slope (m): {m:.4f}")
print(f"Intercept (b): {b:.4f}")
print(f"Predicted marks for 11 hours: {m*11+b:.1f}")` },
      { id: 'ai-2', title: 'K-Means Clustering', difficulty: 'Medium',
        description: 'Implement K-Means clustering from scratch in Python for 2D data points. Show the cluster assignments after convergence.',
        starterCode: `import numpy as np

# 2D data points
data = np.array([[1,1],[1.5,2],[3,4],[5,7],[3.5,5],[4.5,5],[3.5,4.5]])

def kmeans(data, k=2, iters=100):
    # TODO: randomly pick k centroids, iterate:
    # 1. Assign each point to nearest centroid
    # 2. Update centroids as mean of assigned points
    # 3. Stop when centroids don't change
    pass

labels, centroids = kmeans(data, k=2)
for i, (point, label) in enumerate(zip(data, labels)):
    print(f"Point {point} -> Cluster {label}")
print("Centroids:", centroids)` },
      { id: 'ai-3', title: 'Decision Tree (Manual)', difficulty: 'Medium',
        description: 'Build a simple decision tree manually for the Play Tennis dataset. Compute entropy and information gain for each attribute.',
        starterCode: `import math

# Dataset: [Outlook, Temp, Humidity, Wind, PlayTennis]
data = [
    ['Sunny','Hot','High','Weak','No'], ['Sunny','Hot','High','Strong','No'],
    ['Overcast','Hot','High','Weak','Yes'], ['Rain','Mild','High','Weak','Yes'],
    ['Rain','Cool','Normal','Weak','Yes'], ['Rain','Cool','Normal','Strong','No'],
    ['Overcast','Cool','Normal','Strong','Yes'], ['Sunny','Mild','High','Weak','No'],
    ['Sunny','Cool','Normal','Weak','Yes'], ['Rain','Mild','Normal','Weak','Yes'],
]

def entropy(labels):
    # TODO: compute entropy = -sum(p * log2(p))
    pass

def info_gain(data, attr_idx, target_idx=-1):
    # TODO: compute information gain for splitting on attr_idx
    pass

labels = [row[-1] for row in data]
print(f"Total Entropy: {entropy(labels):.4f}")
for i, name in enumerate(['Outlook','Temp','Humidity','Wind']):
    print(f"Info Gain ({name}): {info_gain(data, i):.4f}")` },
      { id: 'ai-4', title: 'A* Search', difficulty: 'Hard',
        description: 'Implement the A* search algorithm to find the shortest path in a grid from Start to Goal, avoiding obstacles.',
        starterCode: `import heapq

# Grid: 0=free, 1=obstacle, S=start, G=goal
grid = [
    [0,0,0,0,0],
    [0,1,1,0,0],
    [0,0,0,1,0],
    [0,1,0,0,0],
    [0,0,0,0,0],
]
start = (0,0)
goal = (4,4)

def heuristic(a, b):
    # Manhattan distance
    return abs(a[0]-b[0]) + abs(a[1]-b[1])

def astar(grid, start, goal):
    # TODO: implement A* with open list (min-heap)
    # Return the path as list of (row, col) tuples
    pass

path = astar(grid, start, goal)
print("Path found:", path)
# Visualize
for r in range(5):
    row = ""
    for c in range(5):
        if (r,c) == start: row += "S "
        elif (r,c) == goal: row += "G "
        elif grid[r][c] == 1: row += "# "
        elif path and (r,c) in path: row += ". "
        else: row += "  "
    print(row)` },
      { id: 'ai-5', title: 'Naive Bayes Classifier', difficulty: 'Medium',
        description: 'Implement a simple Naive Bayes email spam classifier from scratch using word frequency counts.',
        starterCode: `from collections import defaultdict

# Training data: (text, label)
train = [
    ("win money free prize lottery", "spam"),
    ("free offer click here win", "spam"),
    ("meeting tomorrow project deadline", "ham"),
    ("please review the code pull request", "ham"),
    ("congratulations you won free iphone", "spam"),
    ("can we schedule a call today", "ham"),
]

def train_naive_bayes(data):
    # TODO: compute P(spam), P(ham), word probabilities
    word_counts = {'spam': defaultdict(int), 'ham': defaultdict(int)}
    class_counts = {'spam': 0, 'ham': 0}
    # return model dict
    pass

def predict(model, text):
    # TODO: return 'spam' or 'ham'
    pass

model = train_naive_bayes(train)
tests = ["free money prize", "project meeting deadline", "win free lottery"]
for t in tests:
    print(f"'{t}' -> {predict(model, t)}")` },
    ],
  },

  'foundations-ds': {
    topics: [
      'Python for Data Science: NumPy & pandas', 'Data Collection & Cleaning',
      'Exploratory Data Analysis (EDA)', 'Descriptive Statistics',
      'Data Visualization: Matplotlib & Seaborn', 'Correlation & Regression Analysis',
      'Hypothesis Testing Basics', 'Feature Engineering & Selection',
      'Intro to Machine Learning with Scikit-learn', 'Case Study: Real Dataset Analysis',
    ],
    codingProblems: [
      { id: 'ds-1', title: 'pandas EDA', difficulty: 'Easy',
        description: 'Given a student marks dataset, perform EDA: find mean, median, std, min, max, and identify students below average.',
        starterCode: `import pandas as pd
import statistics

data = {
    'name': ['Alice','Bob','Charlie','Devansh','Eve','Frank','Grace','Heidi'],
    'maths': [85,72,91,68,78,95,82,74],
    'physics': [79,65,88,72,84,91,70,83],
    'chemistry': [88,70,85,75,80,88,76,71],
}
df = pd.DataFrame(data)

# TODO: compute and print:
print("=== Summary ===")
print(df.describe())  # built-in summary

# Mean marks for each subject
# Students below average in maths
# Top scorer in each subject
# Total marks per student, sorted descending` },
      { id: 'ds-2', title: 'Data Cleaning', difficulty: 'Easy',
        description: 'Clean a dataset with missing values, duplicates, and incorrect types using pandas.',
        starterCode: `import pandas as pd
import numpy as np

raw = pd.DataFrame({
    'id': [1, 2, 2, 3, 4, None],
    'age': [20, None, 22, 19, 25, 21],
    'score': ['85', '90', '90', None, '75', '88'],
    'grade': ['A', 'A', 'A', 'B', None, 'A']
})
print("Before cleaning:")
print(raw, "\\n")

# TODO:
# 1. Remove duplicate rows
# 2. Fill missing age with median
# 3. Convert score to numeric, fill missing with mean
# 4. Fill missing grade with mode
# 5. Drop rows where id is missing
clean = raw.copy()
# ... your cleaning code here
print("After cleaning:")
print(clean)` },
      { id: 'ds-3', title: 'Correlation Analysis', difficulty: 'Medium',
        description: 'Compute Pearson correlation between study hours and exam scores. Interpret the result.',
        starterCode: `import math

hours   = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
scores  = [52, 58, 64, 68, 75, 79, 84, 88, 93, 97]

def pearson_corr(x, y):
    n = len(x)
    mean_x = sum(x) / n
    mean_y = sum(y) / n
    # TODO: compute r = cov(x,y) / (std_x * std_y)
    pass

r = pearson_corr(hours, scores)
print(f"Pearson r = {r:.4f}")
if r > 0.8:   print("Strong positive correlation")
elif r > 0.5: print("Moderate positive correlation")
else:         print("Weak correlation")` },
      { id: 'ds-4', title: 'Chi-Square Test', difficulty: 'Medium',
        description: 'Perform a Chi-Square test of independence to check if gender and course preference are independent.',
        starterCode: `# Observed frequency table:
# Rows = Gender (Male, Female)
# Cols = Preference (CSE, AIML, ECE)
observed = [[30, 20, 10], [20, 35, 15]]

def chi_square(observed):
    rows = len(observed)
    cols = len(observed[0])
    row_totals = [sum(r) for r in observed]
    col_totals = [sum(observed[r][c] for r in range(rows)) for c in range(cols)]
    total = sum(row_totals)

    chi2 = 0
    for r in range(rows):
        for c in range(cols):
            expected = # TODO
            chi2 += # TODO: (observed - expected)^2 / expected
    return chi2, (rows-1)*(cols-1)  # chi2, degrees of freedom

chi2, df = chi_square(observed)
print(f"Chi² = {chi2:.4f}, df = {df}")
print("Critical value at α=0.05, df=2 is 5.991")
print("Reject H₀" if chi2 > 5.991 else "Fail to reject H₀")` },
      { id: 'ds-5', title: 'Feature Scaling', difficulty: 'Easy',
        description: 'Implement Min-Max Normalization and Z-Score Standardization from scratch. Compare scaled vs original data.',
        starterCode: `data = [150, 200, 250, 300, 350, 400, 450, 500]

def min_max(data):
    mn, mx = min(data), max(data)
    return [(x - mn) / (mx - mn) for x in data]

def z_score(data):
    mean = sum(data) / len(data)
    std = (sum((x-mean)**2 for x in data) / len(data)) ** 0.5
    # TODO: return normalized list
    pass

print("Original:    ", data)
print("Min-Max:     ", [round(x,3) for x in min_max(data)])
print("Z-Score:     ", [round(x,3) for x in z_score(data)])` },
    ],
  },

  'stat-inference': {
    topics: [
      'Probability & Random Variables', 'Probability Distributions: Normal, Binomial, Poisson',
      'Sampling Distributions & CLT', 'Point & Interval Estimation',
      'Hypothesis Testing: Z-test, T-test', 'Type I & Type II Errors',
      'Chi-Square & F-tests', 'ANOVA', 'Bayesian Inference Basics', 'Regression Analysis',
    ],
    codingProblems: [
      { id: 'si-1', title: 'Descriptive Statistics', difficulty: 'Easy',
        description: 'Compute mean, median, mode, variance, standard deviation, and the 5-number summary for a dataset.',
        starterCode: `import math
from collections import Counter

data = [23, 45, 12, 67, 34, 45, 78, 12, 56, 34, 45, 90, 23, 12, 67]

def mean(d): return sum(d)/len(d)
def median(d):
    s = sorted(d); n = len(s)
    return (s[n//2-1]+s[n//2])/2 if n%2==0 else s[n//2]
def mode(d): return Counter(d).most_common(1)[0][0]
def variance(d): m=mean(d); return sum((x-m)**2 for x in d)/len(d)
def std_dev(d): return math.sqrt(variance(d))

print(f"Mean:     {mean(data):.2f}")
print(f"Median:   {median(data):.2f}")
print(f"Mode:     {mode(data)}")
print(f"Variance: {variance(data):.2f}")
print(f"Std Dev:  {std_dev(data):.2f}")
# TODO: print 5-number summary (min, Q1, median, Q3, max)` },
      { id: 'si-2', title: 'Z-Test (One Sample)', difficulty: 'Medium',
        description: 'Perform a one-sample Z-test to check if the population mean equals a claimed value. Compute the Z-score and p-value.',
        starterCode: `import math

# Sample data: exam scores
sample = [72, 68, 75, 80, 65, 70, 78, 74, 69, 73]
claimed_mean = 70  # H0: μ = 70
pop_std = 8        # known population std

def z_test(sample, mu0, sigma):
    n = len(sample)
    x_bar = sum(sample) / n
    se = sigma / math.sqrt(n)
    z = (x_bar - mu0) / se
    return z, x_bar, se

z, x_bar, se = z_test(sample, claimed_mean, pop_std)
print(f"Sample mean: {x_bar:.2f}")
print(f"Standard error: {se:.4f}")
print(f"Z-score: {z:.4f}")
print(f"Critical value (α=0.05, two-tail): ±1.96")
print("Reject H₀" if abs(z) > 1.96 else "Fail to reject H₀")` },
      { id: 'si-3', title: 'Normal Distribution', difficulty: 'Easy',
        description: 'Implement the normal (Gaussian) PDF and CDF from scratch. Plot probabilities for various z-scores.',
        starterCode: `import math

def normal_pdf(x, mu=0, sigma=1):
    # TODO: return f(x) = (1/σ√2π) * e^(-0.5*((x-μ)/σ)²)
    pass

def erf_approx(x):
    # Approximation of error function
    a = 0.147
    sign = 1 if x >= 0 else -1
    t = x*x
    return sign * math.sqrt(1 - math.exp(-t * (4/math.pi + a*t) / (1 + a*t)))

def normal_cdf(x, mu=0, sigma=1):
    # TODO: P(X <= x) using erf_approx
    pass

print("PDF values:")
for x in [-2, -1, 0, 1, 2]:
    print(f"  PDF({x}) = {normal_pdf(x):.6f}")

print("\\nCDF values (P(X ≤ z)):")
for z in [-2, -1, 0, 1, 2]:
    print(f"  P(X≤{z}) = {normal_cdf(z):.4f}")` },
      { id: 'si-4', title: 'Confidence Interval', difficulty: 'Easy',
        description: 'Compute 90%, 95%, and 99% confidence intervals for a population mean given sample data.',
        starterCode: `import math

sample = [85, 90, 78, 92, 88, 76, 95, 83, 87, 91]
# For known population std (simplified):
pop_std = 6

def confidence_interval(sample, sigma, confidence):
    n = len(sample)
    x_bar = sum(sample) / n
    se = sigma / math.sqrt(n)
    # Z-values for common confidence levels
    z_values = {0.90: 1.645, 0.95: 1.96, 0.99: 2.576}
    z = z_values[confidence]
    margin = z * se
    return x_bar - margin, x_bar + margin

for conf in [0.90, 0.95, 0.99]:
    lo, hi = confidence_interval(sample, pop_std, conf)
    print(f"{int(conf*100)}% CI: ({lo:.2f}, {hi:.2f})")` },
      { id: 'si-5', title: 'Bayesian Update', difficulty: 'Hard',
        description: 'Implement Bayesian probability update. Start with a prior belief and update it with new evidence using Bayes theorem.',
        starterCode: `# Bayesian Coin Fairness Test
# Prior: coin is fair (P(H)=0.5) with moderate confidence
# Update belief after observing coin flips

def bayesian_update(prior_heads, prior_tails, observations):
    """
    observations: list of 'H' or 'T'
    Returns posterior probability that coin is fair
    """
    alpha = prior_heads  # successes (heads) in prior
    beta  = prior_tails  # failures  (tails) in prior

    for obs in observations:
        if obs == 'H': alpha += 1
        else:          beta  += 1

    # Posterior mean of p(heads) under Beta distribution
    posterior_mean = alpha / (alpha + beta)
    return posterior_mean, alpha, beta

# Start with: 5 heads, 5 tails (weakly fair)
observations = ['H','H','H','H','H','H','T','H','H','T']
p, a, b = bayesian_update(5, 5, observations)
print(f"Prior: P(Heads) = 0.500")
print(f"Observations: {observations}")
print(f"Posterior: P(Heads) = {p:.4f}")
print(f"Alpha={a}, Beta={b}")
print("Conclusion:", "Possibly biased" if abs(p-0.5) > 0.1 else "Likely fair")` },
    ],
  },

  'adv-math': {
    topics: [
      'Matrices: Rank, Eigenvalues, Eigenvectors', 'Systems of Linear Equations',
      'Fourier Series & Transforms', 'Laplace Transforms',
      'Partial Differential Equations', 'Z-Transforms',
      'Numerical Methods: Bisection, Newton-Raphson', 'Numerical Integration',
      'Probability Distributions Review', 'Complex Variables',
    ],
    codingProblems: [
      { id: 'am-1', title: 'Matrix Operations', difficulty: 'Easy',
        description: 'Implement matrix multiplication, transpose, and determinant computation from scratch in Python.',
        starterCode: `def mat_mul(A, B):
    rows_A, cols_A = len(A), len(A[0])
    cols_B = len(B[0])
    C = [[0]*cols_B for _ in range(rows_A)]
    for i in range(rows_A):
        for j in range(cols_B):
            for k in range(cols_A):
                C[i][j] += A[i][k] * B[k][j]
    return C

def transpose(A):
    # TODO
    pass

def det2x2(A):
    # TODO: for 2x2 matrix
    pass

A = [[1,2],[3,4]]
B = [[5,6],[7,8]]
print("A×B =", mat_mul(A,B))
print("Aᵀ  =", transpose(A))
print("det(A) =", det2x2(A))` },
      { id: 'am-2', title: 'Newton-Raphson Method', difficulty: 'Medium',
        description: 'Implement Newton-Raphson method to find roots of f(x) = x³ - 2x - 5.',
        starterCode: `def f(x):   return x**3 - 2*x - 5
def df(x):  return 3*x**2 - 2   # derivative

def newton_raphson(f, df, x0, tol=1e-6, max_iter=100):
    x = x0
    for i in range(max_iter):
        fx = f(x)
        if abs(fx) < tol:
            return x, i
        x = x - fx/df(x)  # TODO: understand this step
    return x, max_iter

root, iters = newton_raphson(f, df, x0=2.0)
print(f"Root found: {root:.8f}")
print(f"Iterations: {iters}")
print(f"Verification: f({root:.4f}) = {f(root):.2e}")` },
      { id: 'am-3', title: 'Numerical Integration (Simpson)', difficulty: 'Medium',
        description: "Implement Simpson's 1/3 rule for numerical integration. Compute ∫₀^π sin(x)dx and compare with exact value (2.0).",
        starterCode: `import math

def simpsons(f, a, b, n):
    # n must be even
    if n % 2 != 0: n += 1
    h = (b - a) / n
    total = f(a) + f(b)
    for i in range(1, n):
        x = a + i * h
        # TODO: add f(x)*4 for odd i, f(x)*2 for even i
        pass
    return total * h / 3

result = simpsons(math.sin, 0, math.pi, 100)
exact = 2.0
print(f"Numerical: {result:.8f}")
print(f"Exact:     {exact:.8f}")
print(f"Error:     {abs(result - exact):.2e}")` },
      { id: 'am-4', title: 'Bisection Method', difficulty: 'Easy',
        description: 'Find the root of f(x) = cos(x) - x in the interval [0, 1] using the Bisection method.',
        starterCode: `import math

def f(x): return math.cos(x) - x

def bisection(f, a, b, tol=1e-7):
    if f(a) * f(b) > 0:
        raise ValueError("f(a) and f(b) must have opposite signs")
    iterations = 0
    while (b - a) / 2 > tol:
        mid = (a + b) / 2
        # TODO: update a or b based on sign of f(mid)
        iterations += 1
    return (a + b) / 2, iterations

root, iters = bisection(f, 0, 1)
print(f"Root: {root:.8f}")
print(f"Iterations: {iters}")
print(f"Verification: f({root:.4f}) = {f(root):.2e}")` },
      { id: 'am-5', title: 'Eigenvalue Power Method', difficulty: 'Hard',
        description: "Implement the Power Iteration method to find the dominant eigenvalue and eigenvector of a matrix.",
        starterCode: `def mat_vec_mul(A, v):
    return [sum(A[i][j]*v[j] for j in range(len(v))) for i in range(len(A))]

def norm(v):
    return sum(x**2 for x in v) ** 0.5

def power_iteration(A, tol=1e-8, max_iter=1000):
    n = len(A)
    v = [1.0] * n  # initial guess
    eigenvalue = 0
    for _ in range(max_iter):
        Av = mat_vec_mul(A, v)
        new_eigenvalue = Av[max(range(n), key=lambda i: abs(Av[i]))]
        n_v = norm(Av)
        v_new = [x/n_v for x in Av]
        if abs(new_eigenvalue - eigenvalue) < tol:
            return new_eigenvalue, v_new
        eigenvalue = new_eigenvalue
        v = v_new
    return eigenvalue, v

A = [[4,1],[2,3]]
lam, vec = power_iteration(A)
print(f"Dominant eigenvalue: {lam:.6f}")
print(f"Eigenvector: {[round(x,6) for x in vec]}")` },
    ],
  },

  'coa': {
    topics: [
      'Basic Computer Organization', 'Number Systems & Data Representation',
      'ALU Design & Boolean Logic', 'Instruction Set Architecture',
      'Memory: Cache, RAM, ROM, Virtual Memory', 'CPU Design & Datapath',
      'Pipelining & Hazards', 'I/O Organization & DMA',
      'RISC vs CISC', 'Parallel Processing Basics',
    ],
    codingProblems: [
      { id: 'coa-1', title: 'Number System Converter', difficulty: 'Easy',
        description: 'Write a C program to convert a decimal number to binary, octal, and hexadecimal without built-in functions.',
        starterCode: `#include <stdio.h>
#include <string.h>

void toBinary(int n) {
    if (n == 0) { printf("0"); return; }
    char bits[32]; int idx = 0;
    while (n > 0) { bits[idx++] = '0' + (n % 2); n /= 2; }
    for (int i = idx-1; i >= 0; i--) printf("%c", bits[i]);
}

void toOctal(int n) {
    // TODO: similar to binary but base 8
}

void toHex(int n) {
    // TODO: digits are 0-9 then A-F
    char hex_digits[] = "0123456789ABCDEF";
}

int main() {
    int nums[] = {10, 255, 1024, 42};
    for (int i = 0; i < 4; i++) {
        int n = nums[i];
        printf("Dec: %d -> Bin: ", n); toBinary(n);
        printf(", Oct: "); toOctal(n);
        printf(", Hex: "); toHex(n);
        printf("\\n");
    }
}` },
      { id: 'coa-2', title: 'Cache Simulation', difficulty: 'Medium',
        description: 'Simulate a direct-mapped cache with 8 slots. Given a sequence of memory accesses, track hits and misses.',
        starterCode: `#include <stdio.h>
#define CACHE_SIZE 8

int cache[CACHE_SIZE];
int valid[CACHE_SIZE];

void init_cache() {
    for (int i = 0; i < CACHE_SIZE; i++) valid[i] = 0;
}

int access_memory(int address) {
    int index = address % CACHE_SIZE;
    if (valid[index] && cache[index] == address) {
        return 1; // HIT
    } else {
        cache[index] = address;
        valid[index] = 1;
        return 0; // MISS
    }
}

int main() {
    init_cache();
    int accesses[] = {1, 2, 3, 4, 1, 5, 1, 9, 2, 1};
    int n = 10, hits = 0, misses = 0;
    for (int i = 0; i < n; i++) {
        int result = access_memory(accesses[i]);
        printf("Access %d: %s\\n", accesses[i], result ? "HIT" : "MISS");
        result ? hits++ : misses++;
    }
    printf("Hit Rate: %.1f%%\\n", 100.0*hits/n);
}` },
      { id: 'coa-3', title: 'Binary Addition (Carry)', difficulty: 'Easy',
        description: 'Implement binary addition of two 8-bit numbers in C. Show the carry at each bit position.',
        starterCode: `#include <stdio.h>

void printBits(int n, int bits) {
    for (int i = bits-1; i >= 0; i--) printf("%d", (n>>i)&1);
}

int binaryAdd(int a, int b, int *carry_out) {
    // TODO: add bit by bit, track carries
    *carry_out = 0;
    return a + b; // replace with bit-level addition
}

int main() {
    int pairs[][2] = {{25, 30}, {127, 1}, {200, 60}};
    for (int i = 0; i < 3; i++) {
        int a = pairs[i][0], b = pairs[i][1], carry;
        int sum = binaryAdd(a, b, &carry);
        printf("  A: "); printBits(a, 8); printf(" (%d)\\n", a);
        printf("  B: "); printBits(b, 8); printf(" (%d)\\n", b);
        printf("Sum: "); printBits(sum, 8); printf(" (%d) Carry=%d\\n\\n", sum, carry);
    }
}` },
      { id: 'coa-4', title: 'Pipeline Hazard Detector', difficulty: 'Medium',
        description: 'Given a sequence of instructions with register reads/writes, detect data hazards (RAW dependencies) in a 5-stage pipeline.',
        starterCode: `#include <stdio.h>
#include <string.h>

typedef struct {
    char name[16];
    char dest[4];    // destination register (e.g., "R1")
    char src1[4];    // source register 1
    char src2[4];    // source register 2
} Instruction;

int hasHazard(Instruction a, Instruction b) {
    // RAW hazard: b reads a register that a writes to
    // TODO: check if b.src1 or b.src2 == a.dest
    return 0;
}

int main() {
    Instruction prog[] = {
        {"ADD",  "R1", "R2", "R3"},
        {"SUB",  "R4", "R1", "R5"},  // RAW: R1 from above
        {"MUL",  "R6", "R7", "R8"},
        {"ADD",  "R9", "R6", "R4"},  // RAW: R6 from above
    };
    int n = 4;
    printf("Hazard Detection:\\n");
    for (int i = 0; i < n-1; i++) {
        if (hasHazard(prog[i], prog[i+1])) {
            printf("Hazard between instruction %d (%s) and %d (%s)\\n",
                   i+1, prog[i].name, i+2, prog[i+1].name);
        }
    }
}` },
      { id: 'coa-5', title: '2\'s Complement Arithmetic', difficulty: 'Easy',
        description: "Implement 2's complement conversion and use it to perform subtraction via addition in C.",
        starterCode: `#include <stdio.h>

void printBits8(int n) {
    for (int i = 7; i >= 0; i--) printf("%d", (n>>i)&1);
}

int twosComplement(int n) {
    // For 8-bit: flip all bits then add 1
    return (~n & 0xFF) + 1;
}

int subtractUsing2s(int a, int b) {
    // a - b = a + (2's complement of b)
    return (a + twosComplement(b)) & 0xFF;
}

int main() {
    int pairs[][2] = {{20, 8}, {100, 45}, {50, 50}};
    for (int i = 0; i < 3; i++) {
        int a = pairs[i][0], b = pairs[i][1];
        int neg_b = twosComplement(b);
        int result = subtractUsing2s(a, b);
        printf("%d - %d:\\n", a, b);
        printf("  A      = "); printBits8(a); printf("\\n");
        printf("  2's(B) = "); printBits8(neg_b); printf("\\n");
        printf("  Result = "); printBits8(result); printf(" = %d\\n\\n", result);
    }
}` },
    ],
  },

  'digital-electronics': {
    topics: [
      'Number Systems & Conversions', 'Boolean Algebra & Logic Gates',
      'Combinational Circuits: Adders, Subtractors', 'Multiplexers & Demultiplexers',
      'Encoders & Decoders', 'Flip-Flops: SR, JK, D, T',
      'Registers & Counters', 'Karnaugh Map Simplification',
      'Memory Chips: ROM, RAM types', 'Programmable Logic Devices',
    ],
    codingProblems: [
      { id: 'de-1', title: 'Logic Gate Simulator', difficulty: 'Easy',
        description: 'Simulate AND, OR, NOT, NAND, NOR, XOR, XNOR gates in C and print truth tables for each.',
        starterCode: `#include <stdio.h>

int AND (int a, int b) { return a & b; }
int OR  (int a, int b) { return a | b; }
int NOT (int a)        { return !a; }
int NAND(int a, int b) { /* TODO */ return 0; }
int NOR (int a, int b) { /* TODO */ return 0; }
int XOR (int a, int b) { /* TODO */ return 0; }
int XNOR(int a, int b) { /* TODO */ return 0; }

void printTruthTable(char* name, int (*gate)(int, int)) {
    printf("\\n=== %s Gate ===\\n", name);
    printf("A  B  Out\\n");
    for (int a=0;a<=1;a++) for (int b=0;b<=1;b++)
        printf("%d  %d  %d\\n", a, b, gate(a, b));
}

int main() {
    printTruthTable("AND",  AND);
    printTruthTable("OR",   OR);
    printTruthTable("NAND", NAND);
    printTruthTable("XOR",  XOR);
}` },
      { id: 'de-2', title: 'Half Adder & Full Adder', difficulty: 'Easy',
        description: 'Implement half adder and full adder circuits in C. Show sum and carry outputs for all input combinations.',
        starterCode: `#include <stdio.h>

void halfAdder(int a, int b, int *sum, int *carry) {
    *sum   = a ^ b;    // XOR
    *carry = a & b;    // AND
}

void fullAdder(int a, int b, int cin, int *sum, int *carry_out) {
    // TODO: use two half adders
}

int main() {
    int sum, carry;
    printf("Half Adder:\\nA B | Sum Carry\\n");
    for (int a=0;a<=1;a++) for (int b=0;b<=1;b++) {
        halfAdder(a,b,&sum,&carry);
        printf("%d %d |  %d    %d\\n",a,b,sum,carry);
    }
    printf("\\nFull Adder:\\nA B Cin | Sum Cout\\n");
    for (int a=0;a<=1;a++) for (int b=0;b<=1;b++) for (int c=0;c<=1;c++) {
        fullAdder(a,b,c,&sum,&carry);
        printf("%d %d  %d  |  %d    %d\\n",a,b,c,sum,carry);
    }
}` },
      { id: 'de-3', title: 'Binary to Gray Code', difficulty: 'Easy',
        description: 'Write a C program to convert 4-bit binary numbers (0-15) to Gray code and print the conversion table.',
        starterCode: `#include <stdio.h>

int binaryToGray(int n) {
    return n ^ (n >> 1);  // XOR with right-shifted self
}

int grayToBinary(int n) {
    // TODO: reverse conversion
    int mask = n;
    while (mask >>= 1) n ^= mask;
    return n;
}

void printBits4(int n) {
    for (int i=3;i>=0;i--) printf("%d", (n>>i)&1);
}

int main() {
    printf("Dec  Binary  Gray  Back-to-Binary\\n");
    for (int i=0;i<16;i++) {
        int gray = binaryToGray(i);
        int back = grayToBinary(gray);
        printf(" %2d   ", i); printBits4(i);
        printf("   "); printBits4(gray);
        printf("      "); printBits4(back); printf("\\n");
    }
}` },
      { id: 'de-4', title: '4-bit Counter Simulation', difficulty: 'Medium',
        description: 'Simulate a 4-bit synchronous up-counter using flip-flop logic in C. Show Q3Q2Q1Q0 state at each clock cycle.',
        starterCode: `#include <stdio.h>

typedef struct { int Q[4]; } Counter;  // Q[0]=LSB, Q[3]=MSB

void clock(Counter *c) {
    // Toggle bits based on synchronous counter logic
    // Q0 toggles every cycle
    // Q1 toggles when Q0=1
    // Q2 toggles when Q0=Q1=1
    // Q3 toggles when Q0=Q1=Q2=1
    // TODO: implement this logic
}

int main() {
    Counter c = {{0,0,0,0}};
    printf("Cycle  Q3 Q2 Q1 Q0  Decimal\\n");
    for (int i=0;i<=16;i++) {
        int val = c.Q[3]*8 + c.Q[2]*4 + c.Q[1]*2 + c.Q[0];
        printf("  %2d    %d  %d  %d  %d    %2d\\n",
               i, c.Q[3], c.Q[2], c.Q[1], c.Q[0], val);
        clock(&c);
    }
}` },
      { id: 'de-5', title: 'K-Map Simplification Check', difficulty: 'Medium',
        description: 'Given a 4-variable Boolean function as a truth table (minterms), output the simplified expression using prime implicants.',
        starterCode: `#include <stdio.h>
#include <string.h>

// Minterm list for the function
int minterms[] = {0, 1, 3, 7, 8, 9, 11, 15};
int n_minterms = 8;

int isMinterms(int m) {
    for (int i=0;i<n_minterms;i++) if (minterms[i]==m) return 1;
    return 0;
}

int diffBits(int a, int b) {
    int x = a^b, count=0;
    while (x) { count += x&1; x>>=1; }
    return count;
}

int main() {
    printf("Minterms: ");
    for (int i=0;i<n_minterms;i++) printf("%d ", minterms[i]);
    printf("\\n\\nK-Map (4 variables: A,B,C,D):\\n");
    printf("     CD\\n    00 01 11 10\\n");
    int rows[] = {0,4,12,8};   // AB: 00,01,11,10
    char *ab[] = {"00","01","11","10"};
    for (int r=0;r<4;r++) {
        printf("AB%s | ",ab[r]);
        int cols[] = {0,1,3,2}; // CD: 00,01,11,10
        for (int c=0;c<4;c++) {
            int m = rows[r] | cols[c];
            printf(" %d  ", isMinterms(m));
        }
        printf("\\n");
    }
    printf("\\n(Identify groups manually from above map)\\n");
}` },
    ],
  },

  'prof-practice': {
    topics: [
      'Engineering Ethics & Professional Responsibility', 'Codes of Conduct for Engineers',
      'Intellectual Property: Patents, Copyrights, Trademarks', 'Cyber Law in India: IT Act 2000',
      'Data Privacy & GDPR Basics', 'Cybercrime Types & Prevention',
      'Digital Signatures & PKI', 'Software Licensing Models',
      'Professional Communication & Report Writing', 'Workplace Ethics & Safety',
    ],
    codingProblems: [
      { id: 'pp-1', title: 'Password Strength Checker', difficulty: 'Easy',
        description: 'Write a Python program to check password strength. Validate: length ≥ 8, has uppercase, lowercase, digit, and special character.',
        starterCode: `import re

def check_password(password):
    checks = {
        'Length ≥ 8': len(password) >= 8,
        'Has uppercase': bool(re.search(r'[A-Z]', password)),
        'Has lowercase': bool(re.search(r'[a-z]', password)),
        'Has digit':     bool(re.search(r'\\d', password)),
        'Has special (!@#$...)': bool(re.search(r'[!@#$%^&*]', password)),
    }
    passed = sum(checks.values())
    strength = ['Very Weak','Weak','Moderate','Strong','Very Strong'][min(passed-1,4)]
    return checks, strength

passwords = ["abc", "password", "Pass@123", "P@55w0rd!", "qwerty123"]
for p in passwords:
    checks, strength = check_password(p)
    print(f"\\nPassword: '{p}' → {strength}")
    for check, result in checks.items():
        print(f"  {'✅' if result else '❌'} {check}")` },
      { id: 'pp-2', title: 'Digital Signature Simulator', difficulty: 'Medium',
        description: 'Simulate the concept of digital signing using hash functions — hash a message and verify tampering detection.',
        starterCode: `import hashlib

def sign_message(message, private_key="lmcst_secret"):
    # Simulate signing: hash(message + private_key)
    content = message + private_key
    signature = hashlib.sha256(content.encode()).hexdigest()
    return signature

def verify_message(message, signature, private_key="lmcst_secret"):
    # Recompute signature and compare
    expected = sign_message(message, private_key)
    return signature == expected

# Original message
original = "Devansh Borana has scored 95% in the exam."
sig = sign_message(original)
print(f"Message:   {original}")
print(f"Signature: {sig[:30]}...")
print(f"Verify (original):  {verify_message(original, sig)}")

# Tampered message
tampered = "Devansh Borana has scored 65% in the exam."
print(f"Verify (tampered):  {verify_message(tampered, sig)}")` },
      { id: 'pp-3', title: 'Plagiarism Detector', difficulty: 'Medium',
        description: 'Build a simple plagiarism checker using cosine similarity of word frequency vectors.',
        starterCode: `import math
from collections import Counter

def word_freq(text):
    words = text.lower().split()
    return Counter(words)

def cosine_similarity(text1, text2):
    freq1 = word_freq(text1)
    freq2 = word_freq(text2)
    all_words = set(freq1) | set(freq2)
    v1 = [freq1.get(w, 0) for w in all_words]
    v2 = [freq2.get(w, 0) for w in all_words]
    dot = sum(a*b for a,b in zip(v1,v2))
    mag1 = math.sqrt(sum(x**2 for x in v1))
    mag2 = math.sqrt(sum(x**2 for x in v2))
    return dot / (mag1 * mag2) if mag1 and mag2 else 0

original = "Data structures are the backbone of computer science algorithms"
similar  = "Algorithms in computer science rely on data structures as backbone"
diff     = "Machine learning uses neural networks for pattern recognition"

print(f"Original vs Similar: {cosine_similarity(original, similar):.2%}")
print(f"Original vs Diff:    {cosine_similarity(original, diff):.2%}")` },
      { id: 'pp-4', title: 'File Permission System', difficulty: 'Easy',
        description: 'Simulate Unix-style file permission checking (read/write/execute) for owner, group, and others.',
        starterCode: `def parse_permissions(perm_string):
    # e.g. "rwxr-xr--"
    perms = {'owner': {}, 'group': {}, 'others': {}}
    labels = ['owner', 'group', 'others']
    for i, label in enumerate(labels):
        chunk = perm_string[i*3:(i+1)*3]
        perms[label] = {
            'read':    chunk[0] == 'r',
            'write':   chunk[1] == 'w',
            'execute': chunk[2] == 'x',
        }
    return perms

files = {
    "report.pdf":  "rw-r--r--",
    "script.sh":   "rwxr-xr-x",
    "secret.key":  "rw-------",
}

for filename, perm_str in files.items():
    perms = parse_permissions(perm_str)
    print(f"\\n{filename} ({perm_str})")
    for role, p in perms.items():
        rights = [k for k,v in p.items() if v]
        print(f"  {role:8}: {', '.join(rights) if rights else 'none'}")` },
      { id: 'pp-5', title: 'Caesar Cipher', difficulty: 'Easy',
        description: 'Implement Caesar cipher encryption and decryption. Also write a brute-force cracker that tries all 26 shifts.',
        starterCode: `def caesar_encrypt(text, shift):
    result = ""
    for char in text:
        if char.isalpha():
            base = ord('A') if char.isupper() else ord('a')
            result += chr((ord(char) - base + shift) % 26 + base)
        else:
            result += char
    return result

def caesar_decrypt(text, shift):
    return caesar_encrypt(text, 26 - shift)

def brute_force(ciphertext):
    print("Brute force attack:")
    for shift in range(26):
        print(f"  Shift {shift:2}: {caesar_decrypt(ciphertext, shift)}")

message = "Lachoo Memorial College"
encrypted = caesar_encrypt(message, 13)  # ROT-13
decrypted = caesar_decrypt(encrypted, 13)

print(f"Original:  {message}")
print(f"Encrypted: {encrypted}")
print(f"Decrypted: {decrypted}")
print()
brute_force(encrypted)` },
    ],
  },

  'entrepreneurship': {
    topics: [
      'Entrepreneurship Mindset & Opportunity Recognition', 'Business Models & Value Proposition',
      'Lean Startup & MVP', 'Market Research & Validation',
      'Product-Market Fit', 'Funding: Bootstrapping, Angels, VCs',
      'Intellectual Property for Startups', 'Financial Planning & Break-even Analysis',
      'Team Building & Leadership', 'Pitching & Presentation Skills',
    ],
    codingProblems: [
      { id: 'entr-1', title: 'Break-Even Calculator', difficulty: 'Easy',
        description: 'Build a break-even analysis tool: compute break-even units, margin of safety, and profit/loss at different volumes.',
        starterCode: `def break_even_analysis(fixed_cost, price_per_unit, variable_cost_per_unit):
    contribution_margin = price_per_unit - variable_cost_per_unit
    if contribution_margin <= 0:
        return None
    breakeven_units = fixed_cost / contribution_margin
    breakeven_revenue = breakeven_units * price_per_unit
    return {
        'contribution_margin': contribution_margin,
        'breakeven_units': breakeven_units,
        'breakeven_revenue': breakeven_revenue
    }

# Example: EdTech startup
fixed  = 50000   # monthly fixed costs (Rs.)
price  = 999     # per course
var_cost = 200   # per sale (hosting, payment gateway)

result = break_even_analysis(fixed, price, var_cost)
print(f"Contribution Margin: Rs.{result['contribution_margin']}")
print(f"Break-Even Units:    {result['breakeven_units']:.0f} sales/month")
print(f"Break-Even Revenue:  Rs.{result['breakeven_revenue']:,.0f}")

# P&L at different volumes
for units in [30, 60, 100, 150]:
    profit = units * result['contribution_margin'] - fixed
    print(f"At {units:3} sales: {'Profit' if profit>=0 else 'Loss'} Rs.{abs(profit):,.0f}")` },
      { id: 'entr-2', title: 'SWOT Analysis Tool', difficulty: 'Easy',
        description: 'Build a Python SWOT analysis organizer. Input strengths, weaknesses, opportunities, threats and generate a report.',
        starterCode: `def swot_analysis(company):
    print(f"\\n{'='*50}")
    print(f"SWOT ANALYSIS: {company['name']}")
    print(f"{'='*50}")

    categories = {
        'STRENGTHS (Internal +)':     company.get('strengths', []),
        'WEAKNESSES (Internal -)':    company.get('weaknesses', []),
        'OPPORTUNITIES (External +)': company.get('opportunities', []),
        'THREATS (External -)':       company.get('threats', []),
    }

    for category, items in categories.items():
        print(f"\\n{category}:")
        for i, item in enumerate(items, 1):
            print(f"  {i}. {item}")

# Example: A student startup
startup = {
    'name': 'EduTrack — Smart Attendance App',
    'strengths': ['Low cost to build', 'Solves real college problem', 'AI-powered'],
    'weaknesses': ['No marketing budget', 'Small team', 'No revenue yet'],
    'opportunities': ['500+ colleges in Rajasthan', 'Government digitization push', 'Growing EdTech market'],
    'threats': ['Established competitors', 'Data privacy concerns', 'Low adoption rate'],
}
swot_analysis(startup)` },
      { id: 'entr-3', title: 'Startup ROI Calculator', difficulty: 'Easy',
        description: 'Compute ROI, payback period, and projected 3-year revenue for a startup idea given investment and revenue data.',
        starterCode: `def startup_financials(initial_investment, monthly_revenue, monthly_cost, growth_rate=0.1):
    print(f"Initial Investment: Rs.{initial_investment:,.0f}")
    print(f"Monthly Revenue: Rs.{monthly_revenue:,.0f}")
    print(f"Monthly Cost: Rs.{monthly_cost:,.0f}")
    print(f"Monthly Growth Rate: {growth_rate*100:.0f}%\\n")

    total_profit = 0
    month_breakeven = None
    revenue = monthly_revenue
    cost = monthly_cost

    print("Month | Revenue    | Profit     | Cumulative")
    for month in range(1, 37):
        profit = revenue - cost
        total_profit += profit
        if total_profit >= initial_investment and not month_breakeven:
            month_breakeven = month
        if month % 12 == 0:
            print(f"  {month:2}  | {revenue:10,.0f} | {profit:10,.0f} | {total_profit:10,.0f}")
        revenue *= (1 + growth_rate)

    roi = (total_profit - initial_investment) / initial_investment * 100
    print(f"\\n3-Year Total Profit: Rs.{total_profit:,.0f}")
    print(f"ROI: {roi:.1f}%")
    print(f"Payback Period: {'Month '+str(month_breakeven) if month_breakeven else '>36 months'}")

startup_financials(200000, 15000, 8000, 0.08)` },
      { id: 'entr-4', title: 'Market Size Calculator (TAM/SAM/SOM)', difficulty: 'Easy',
        description: 'Compute TAM, SAM, and SOM for a business idea and visualize the funnel.',
        starterCode: `def market_size(tam_size, sam_pct, som_pct, price):
    """
    tam_size: Total Addressable Market (# users)
    sam_pct:  Serviceable Addressable Market (% of TAM you can reach)
    som_pct:  Serviceable Obtainable Market (% of SAM you can capture)
    price:    Annual revenue per user
    """
    tam = tam_size
    sam = int(tam * sam_pct)
    som = int(sam * som_pct)

    print(f"\\nMarket Analysis:")
    print(f"{'TAM':5} (Total Addressable):     {tam:>10,} users = Rs.{tam*price:>15,.0f}")
    print(f"{'SAM':5} (Serviceable {sam_pct*100:.0f}% of TAM): {sam:>10,} users = Rs.{sam*price:>15,.0f}")
    print(f"{'SOM':5} (Obtainable {som_pct*100:.0f}% of SAM):  {som:>10,} users = Rs.{som*price:>15,.0f}")
    print(f"\\nYear 1 Target Revenue: Rs.{som*price:,.0f}")

# Example: College ERP system for India
# 40,000 colleges, avg 2000 students, Rs.500/year per student
market_size(
    tam_size=40000 * 2000,
    sam_pct=0.10,   # target colleges in Rajasthan
    som_pct=0.05,   # realistic first-year capture
    price=500
)` },
      { id: 'entr-5', title: 'Pitch Deck Outline Generator', difficulty: 'Easy',
        description: 'Build a tool that generates a structured pitch deck outline given basic startup information.',
        starterCode: `def generate_pitch_deck(startup):
    slides = [
        ("1. COVER", [
            f"🚀 {startup['name']}",
            f"Tagline: {startup['tagline']}",
            f"Founders: {', '.join(startup['founders'])}",
        ]),
        ("2. PROBLEM", [f"Problem: {startup['problem']}", "Who faces this? College students & faculty"]),
        ("3. SOLUTION", [f"Solution: {startup['solution']}", f"Key Feature: {startup['key_feature']}"]),
        ("4. MARKET SIZE", [f"TAM: {startup['tam']}", f"SAM: {startup['sam']}", f"SOM: {startup['som']}"]),
        ("5. BUSINESS MODEL", [f"Revenue: {startup['revenue_model']}", f"Price: {startup['pricing']}"]),
        ("6. TRACTION", [f"Users: {startup['users']}", f"MRR: {startup['mrr']}"]),
        ("7. TEAM", [f"Founders: {', '.join(startup['founders'])}", f"Skills: {startup['skills']}"]),
        ("8. ASK", [f"Seeking: {startup['ask']}", f"Use of funds: {startup['use_of_funds']}"]),
    ]

    print(f"{'='*60}")
    print(f"PITCH DECK: {startup['name'].upper()}")
    print(f"{'='*60}")
    for title, points in slides:
        print(f"\\n[{title}]")
        for p in points: print(f"  • {p}")

generate_pitch_deck({
    'name': 'EduTrack', 'tagline': 'Smart Attendance for Smart Colleges',
    'founders': ['Devansh Borana', 'Priya Sharma'],
    'problem': 'Manual attendance is slow, inaccurate, and easily manipulated',
    'solution': 'AI-powered face recognition attendance via mobile app',
    'key_feature': 'Real-time parent notifications + analytics dashboard',
    'tam': 'Rs.400 Cr (India EdTech)',
    'sam': 'Rs.40 Cr (Rajasthan colleges)',
    'som': 'Rs.2 Cr (Year 1 target)',
    'revenue_model': 'SaaS subscription per college',
    'pricing': 'Rs.25,000/college/year',
    'users': '5 pilot colleges, 2,000 students',
    'mrr': 'Rs.10,000',
    'skills': 'Full-stack dev, AI/ML, Business development',
    'ask': 'Rs.50 Lakhs seed funding',
    'use_of_funds': 'Engineering (60%), Marketing (25%), Operations (15%)',
})` },
    ],
  },
}
