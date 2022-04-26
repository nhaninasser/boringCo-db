-- Inserts data into department table
INSERT INTO department (name)
VALUES ('Management'), ('Engineers'), ('Interns');

-- Inserts data into role table
INSERT INTO role (title, salary, department_id)
VALUES
("CEO", 500000.00, 1),
("Vice President", 300000.00, 1),
("Software Engineer", 100000.00. 2),
("Electrical Engineer", 180000.00, 2),
("Mechanical Engineer", 160000.00, 2),
("Entry Level", 85000.00, 3),
("Intern", 55000.00, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
      ("Elon", "Musk", 1, NULL),
      ("Steve", "Davis", 2, 1),
      ("Seth", "Hopper", 4, 2),
      ("Mark", "Muniz", 5, NULL),
      ("Joey", "Diaz", 3, NULL),
      ("Joe", "Rogan", 6, 3),
      ("Andrew", "Shulz", 7, 3);


