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