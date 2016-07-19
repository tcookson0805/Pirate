var Question = function(obj){
  this.text = obj.text;
  this.type = obj.type;
};


var Ingredient = function(){
  this.item = undefined;
  this.characteristic = undefined;
};


var Customer = function(){
  this.drinkPreferences = {};
};


var Bartender = function(){};


Bartender.prototype.askQuestion = function(template, question){
  template.find('.question_text').text(question.text)
  template.appendTo('.hero_box').fadeIn('slow');
};


Bartender.prototype.getAnswer = function(customer, question, answer){
  if(answer === 'true'){
    customer.drinkPreferences[question.type] = true;     
  }  
};


Bartender.prototype.createDrink = function(customer, pantry){
  var drink = []  
  _.each(customer.drinkPreferences, function(wants, type){
    var list = []
    _.each(pantry.inventory, function(ingredient){
      if(ingredient.trait === type){
        list.push(ingredient.name);
      }
    })
    var randomNum = Math.floor(Math.random() * list.length);
    drink.push(list[randomNum])
  })
  return drink;
};


var Pantry = function(ingredients){
  this.inventory = ingredients
};


var DrinkIngredients = [
  {name : 'glug of rum', trait: 'strong'},
  {name : 'slug of whisky', trait : 'strong'},
  {name : 'splash of gin', trait : 'strong'},
  {name : 'olive on a stick', trait : 'salty'},
  {name : 'salt-dusted rim', trait : 'salty'},
  {name : 'rasher of bacon', triat : 'salty'},
  {name : 'shake of bitters', trait : 'bitter'},
  {name : 'splash of tonic', trait : 'bitter'},
  {name : 'twist of lemon peel', trait : 'bitter'},
  {name : 'sugar cube', trait : 'sweet'},
  {name : 'spoonful of honey', trait : 'sweet'},
  {name : 'splash of cola', trait : 'sweet'},
  {name : 'slice of orange', trait : 'fruity'},
  {name : 'dash of cassis', trait : 'fruity'},
  {name : 'cherry on top', trait : 'fruity'}
];


var QuestionList = {
  DrinkQuestions : [
                      {text : 'Do ye like yer drinks strong?', type : 'strong'},
                      {text : 'Do ye like it with a salty tang?', type : 'salty'},
                      {text : 'Are ye a lubber who likes it bitter?', type : 'bitter'},
                      {text : 'Would ye like a bit of sweetness with yer poison?', type : 'sweet'},
                      {text : 'Are ye one for a fruity finish?', type : 'fruity'}
                    ]
};

                
$(document).ready(function(){
  
  var customer = new Customer();
  var bartender = new Bartender();
  var pantry = new Pantry(DrinkIngredients);
  var questionTemplate = $('.question_form').clone();
  var resultTemplate = $('.drink_result').clone();
  var question;

  
  var changeQuestion = function(array){
    $('.hero_box').children().remove();
    if(array.length){
      var randomIndex = Math.floor(Math.random() * array.length);
      var questionObj = array.splice(randomIndex, 1);
      question = new Question(questionObj[0]);
      template = questionTemplate;
      template.find('input[type="checkbox"]:checked').attr('checked', false);
      bartender.askQuestion(template, question);  
    }else{
      var drinkIngredients = bartender.createDrink(customer, pantry);
      _.each(drinkIngredients, function(ingredient){
        resultTemplate.find('.drink_result_ingredients').append('<div>' + ingredient + '</div>')
      })
      $('.hero_box').children().remove();
      $('.hero_box').append(resultTemplate);
    }
  };
  
  
  $('body').on('click', '.ready_to_drink', function(){  
    $(this).fadeOut('slow');
    setTimeout(function(){changeQuestion(QuestionList.DrinkQuestions)}, 1000);  
  });
  
  
  $('body').on('click', 'input', function(){  
    var answer = $('input[type="checkbox"]:checked').val()
    bartender.getAnswer(customer, question, answer);
    $('.question_form').fadeOut('slow');
    setTimeout(function(){changeQuestion(QuestionList.DrinkQuestions)}, 1000);
  });
  
  
});


