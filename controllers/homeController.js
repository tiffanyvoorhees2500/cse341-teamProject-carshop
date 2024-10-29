// exports.buildHome = (req, res, isLoggedIn, userName) => {
//     // Create the dynamic homepage content
//     const welcomeMessage = isLoggedIn
//       ? `<h1>Welcome, ${userName} to Team Car Shop!</h1>`
//       : `<h1>You are logged out.</h1>`;
  
//     const homePage = `
//       <html>
//         <head>
//           <title>Team Car Shop</title>
//           <style>
//             body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
//             button { margin: 20px; padding: 10px 20px; font-size: 18px; }
//           </style>
//         </head>
//         <body>
//           ${welcomeMessage}
//           <button onclick="window.location.href='/api-docs'">Swagger API Docs</button>
//           <button onclick="window.location.href='/login'">Login</button>
//         </body>
//       </html>
//     `;
  
//     res.send(homePage);
//   };
exports.buildHome = (req, res) => {
    const user = req.session.user;
    const isLoggedIn = user !== undefined;

    const welcomeMessage = isLoggedIn
        ? `<h1>Welcome ${user.displayName} to our Team Car Shop!</h1>`
        : `<h1>You are logged out. Try logging in!</h1>`;

    const homePageHTML = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Car API Home</title>
        <link rel="stylesheet" href="/css/styles.css">
    </head>
    <body>
        ${welcomeMessage}
        <div class="button-container">
            <a href="/api-docs" class="button">Swagger API Docs</a>
            ${
              isLoggedIn
                ? `<a href="/logout" class="button">Logout</a>`
                : `<a href="/login" class="button">Login</a>`
            }
            <a href="https://github.com/tiffanyvoorhees2500/cse341-teamProject-carshop" class="button">Documentation</a>
        </div>
    </body>
    <footer>
        <p>341-Final || Created by Tiffany Voorhees, Luke Briggs, Jonathan Aloya & Emmanuel Ekenedo | 2024 | Api for Education |
        <p class="right">Repo <a href="https://github.com/tiffanyvoorhees2500/cse341-teamProject-carshop">Check out our GitHub repo</a></p>
    </footer>
    </html>
    `;
    
    res.send(homePageHTML);
};


