const {readInputFile} = require('./in');

// const files = ['a_example.in', 'b_should_be_easy.in', 'c_no_hurry.in', 'd_metropolis.in', 'e_high_bonus.in'];
const fileName = 'mother_of_all_warehouses.in';

readInputFile(fileName, (response) => {
    console.log(response);
});