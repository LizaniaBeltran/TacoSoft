CREATE TABLE Categoria(
    CategoriaID SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL
);

CREATE TABLE Producto(
    ProductoID SERIAL PRIMARY KEY,
    Nombre VARCHAR(100) NOT NULL,
    Precio DECIMAL(10,2) NOT NULL,
    CategoriaID INT,

    FOREIGN KEY(CategoriaID)
    REFERENCES Categoria(CategoriaID)
);