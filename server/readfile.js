// Read different types of data from standard input, process them as shown in output format and print the answer to standard output.

// Input format:
// First line contains integer N.
// Second line contains string S.

// Output format:
// First line should contain N x 2.
// Second line should contain the same string S.

// Constraints:

//  where S length of string S
// 0<=N<=100
//  where S contains only lowercase letters
// 1<=S<=15

// process.stdin.resume();
// process.stdin.setEncoding('ascii');

// get input from stdin



process.stdin.resume();
process.stdin.setEncoding("utf-8");
var stdin_input = "";

process.stdin.on("SIGTERM", function (input) {
    // stdin_input += input;                               // Reading input from STDIN
    console.log("you typed: ",input);
});

process.stdin.on("SIGINT", function (input) {
   main(input);
});

function main(input) {
    process.stdout.write("Hi, " + input + "\n");       // Writing output to STDOUT
}


