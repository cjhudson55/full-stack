/* jshint esversion: 6 */

console.log("frontend script is working");

$(document).ready(function () {
    let url;

    // Get config.sjson file
    $.ajax({
        url: 'config.json',
        type: 'GET',
        dataType: 'json',
        success: function (configData) {
            console.log(configData.SERVER_URL, configData.SERVER_PORT);
            url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
            console.log(url);
        },
        error: function (error) {
            console.log(error);
        }
    });
    // View products on click of view products button
    $('#viewProducts').click(function () {
        $.ajax({
            url: `http://${url}/allProductsFromDB`,
            type: 'GET',
            dataType: 'json',
            success: function (productsFromMongo) {
                document.getElementById('result').innerHTML = '';
                for (let i = 0; i < productsFromMongo.length; i++) {
                    console.log(productsFromMongo[i]);
                    document.getElementById('result').innerHTML += `
                        <div class="col-4 mt-3 mb-3">
                            <div class="card">
                                <img class="card-img-top" src="${productsFromMongo[i].img_url}" alt="Card image cap">
                                <div class="card-body">
                                    <h5 class="card-title">${productsFromMongo[i].name}</h5>
                                    <p class="card-text">${productsFromMongo[i].price}</p>
                                    <button id="deleteProduct" value="${productsFromMongo[i]._id}" class="btn btn-primary delete" type="button" name="button">Delete</button>
                                </div>
                            </div>
                        </div>
                    `;
                    deleteButtons();
                    // deleteProduct();
                }
            },
            error: function () {
                alert('unable to get products');
            }
        });
    });
    // end of view products


    // ADD product on form submit
    $('#addProduct').click(function (event) {
        event.preventDefault();
        let name = $('#a-name').val(); //  jquery that is same as getting document get el by id .val
        let price = $('#a-price').val();
        let img_url = $('#a-imageurl').val();
        let userid = sessionStorage.getItem('userID');
        console.log(userid);
        console.log(name, price, img_url);
        // don't want to send any empty stuff so do if stmt checks
        if (name == '' || price == '' || img_url == '' || !userid) {
            alert('Please login enter all details');
        } else {
            $.ajax({
                url: `http://${url}/addProduct`,
                type: 'POST',
                // putting the values from the form into our ajax request
                data: {
                    name: name,
                    price: price,
                    img_url: img_url,
                    user_id: userid
                },
                success: function (product) {
                    console.log(product);
                    alert('Product added');
                },
                error: function () {
                    console.log('Error - cannot call API or add product');
                }
            });
        }
        // end of else
    });
    // end of the ADD products click


    // UPDATE product on form submit

    $('#updateProduct').click(function (event) {
        event.preventDefault();
        let productId = $('#productId').val();
        let productName = $('#productName').val();
        let productPrice = $('#productPrice').val();
        let productImageUrl = $('#imageurl').val();
        let userid = sessionStorage.getItem('userID');
        console.log(productId, productName, productPrice, productImageUrl);
        if (productId == '' || !userid) {
            alert('Please enter product to update');
        } else {
            $.ajax({
                url: `http://${url}/updateProduct/${productId}`,
                type: 'PATCH',
                data: {
                    name: productName,
                    price: productPrice,
                    img_url: productImageUrl,
                },
                success: function (data) {
                    console.log(data);
                },
                error: function () {
                    console.log('error - cannot UPDATE post');
                } // end of error
            }); // end of ajax
        } // end of if
    }); // end of click

    // end of the UPDATE products click



    // DELETE from DB

    function deleteButtons() {
        let deleteButtons = document.querySelectorAll('.delete');
        let buttons = Array.from(deleteButtons);
        buttons.forEach(function (button) {
            button.addEventListener('click', function (event) {
                console.log('working');
                event.preventDefault();
                let productId = this.value;
                let userid = sessionStorage.getItem('userID');
                console.log(productId);
                if (productId == '' || !userid) {
                    alert('Please enter product id to delete');
                } else {
                    $.ajax({
                        url: `http://${url}/deleteProduct/${productId}`,
                        type: 'DELETE',
                        success: function () {
                            console.log('deleted');
                            alert('Product Deleted');
                        },
                        error: function () {
                            console.log('error: cannot delete due to call on api. This ID does not exist');
                        } // error
                    }); // ajax
                } // if
            });
        });
    }



    // End of DELETE from DB



    // ========================= ADD USER API CALLS ===========================
    // ________________________________________________________________________

    // Register User

    $('#r-submit').click(function (event) {
        event.preventDefault();
        let username = $('#r-username').val();
        let password = $('#r-password').val();
        let email = $('#r-email').val();
        console.log(username, email, password);
        if (username == '' || email == '' || password == '') {
            alert('Please enter all details you duffer');
        } else {
            $.ajax({
                url: `http://${url}/registerUser`,
                type: 'POST',
                data: {
                    username: username,
                    email: email,
                    password: password
                },
                success: function (user) {
                    console.log(user); // remove this when deelopment is finished cos will logout the unencrypted pw
                    if (user !== 'username already exists') {
                        sessionStorage.setItem('userID', user['_id']);
                        sessionStorage.setItem('userName', user['username']);
                        sessionStorage.setItem('useremail', user['email']);
                        console.log(sessionStorage);
                        alert('Thanks you for registering. You have been logged in automatically.');
                    } else {
                        alert('Username taken already - try another one');
                        $('r-username').val('');
                        $('r-email').val('');
                        $('r-password').val('');
                    } // end of else
                },
                error: function () {
                    console.log('Cannot call user API');
                } // end of error
            }); // end of ajax
        } // end of the else
    }); // end of submit user click

    // End of Register User


    // Login User
    $('#login-submit').click(function (event) {
        event.preventDefault();
        let username = $('#login-username').val();
        let password = $('#login-password').val();
        console.log(username, password);
        if (username == '' || password == '') {
            alert('Please enter all details - no blanks')
        } else {
            $.ajax({
                url: `http://${url}/loginUser`,
                type: 'POST',
                data: {
                    username: username,
                    password: password
                },
                success: function (user) {
                    console.log(user);
                    if (user == 'User not found - please register') {
                        alert('User not found in DB. Please register');
                    } else if (user == 'Not authorised') {
                        alert('Please try with correct details'); // incorrect password
                        $('#login-username').val('');
                        $('#login-password').val('');
                    } else {
                        sessionStorage.setItem('userID', user['_id']);
                        sessionStorage.setItem('userName', user['username']);
                        sessionStorage.setItem('useremail', user['email']);
                        console.log(sessionStorage);
                        alert('Welcome back Kotter :)');
                    } //end of ifs
                }, // end of success
                error: function () {
                    console.log('error: cannot call api');
                    alert('Unable to login - unable to call API');
                } // end of error
            }); // end of ajax
        } // end of else
    }); // end of login click

    // logout
    $('#logout').click(function () {
        sessionStorage.clear();
        alert('You are now logged out');
        console.log(sessionStorage);
    });


});

// doc ready function ends