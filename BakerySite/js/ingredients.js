$(document).ready(function() {
    // Preview option on single click
    let clickTimeout;
    $('#btn').on('click', function() {
        clearTimeout(clickTimeout);  
        let button = $(this);
        clickTimeout = setTimeout(function() {
            // Single-click action: preview the option
            $('#preview').html('Preview: ' + button.text());
        }, 300);
    });

    /* Navigate to page on double-click */
    $('.option').on('dblclick', function() {
        clearTimeout(clickTimeout);  
        let url = $(this).data('url');
        window.location.href = url;  
    });

    /* Add Ingredient */
    $('#addIngredient').on('click', function() {
        let newIngredient = $('#newIngredient').val();
        if (newIngredient) {
            $('#ingredientList').append('<li>' + newIngredient + ' <button class="deleteIngredient">Delete</button></li>');
            $('#newIngredient').val('');  
        }
    });

    /* Delete Ingredient */
    $('#ingredientList').on('click', '.deleteIngredient', function() {
        $(this).parent().remove();  
    });
});

// Load ingredients from server
$(document).ready(function() {
    // Check if SessionID exists in localStorage
    var sessionID = localStorage.getItem('SessionID');
    console.log('Ing-Retrieved SessionID:', sessionID); // Log the session ID
    if (sessionID) {
        sessionStorage.setItem('SessionID', sessionID);

        
        $.ajax({
            url: '/ingredients',
            method: 'GET',
            headers: {
                'session_id': sessionID
            },
            success: function(response) {
                console.log("inside success");
                if (response.status === "success") {
                    const ingredients = response.content;
                    let cardContainer = $('#ingredient-cards');
                    // create cards for each ingredient
                    ingredients.forEach(ingredient => {
                        let card = `
                            <div class="col-md-4 mb-4">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">${ingredient.Name}</h5>
                                        <p class="card-text">
                                            Quantity: ${ingredient.Quantity} ${ingredient.UnitOfMeasure}<br>
                                            Shelf Life: ${ingredient.ShelfLife} ${ingredient.ShelfLifeUnit}<br>
                                            Reorder Amount: ${ingredient.ReorderAmount} ${ingredient.ReorderUnit}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        `;
                        cardContainer.append(card);
                    });
                } else {
                    console.log(response.reason);
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    } else {
        console.log('SessionID not found in localStorage');
    }
});
