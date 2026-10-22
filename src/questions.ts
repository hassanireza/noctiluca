export type Question={id:number;world:string;title:string;prompt:string;hint:string;starter:string;target:string;test?:string;xp:number};
export const questions:Question[]=[
{id:1,world:'I · FIRST LIGHT',title:'A small signal',prompt:'Print the word hello.',hint:'One built-in function is enough.',starter:'# let the light speak\n',target:'print("hello")',xp:10},
{id:2,world:'I · FIRST LIGHT',title:'Echo chamber',prompt:'Print the number 42.',hint:'Numbers do not need quotation marks.',starter:'',target:'print(42)',xp:10},
{id:3,world:'I · FIRST LIGHT',title:'Two stars',prompt:'Print two stars on one line.',hint:'A string can hold more than one character.',starter:'',target:'print("**")',xp:10},
{id:4,world:'I · FIRST LIGHT',title:'A quiet sum',prompt:'Print the result of 8 + 5.',hint:'Let Python do the arithmetic inside print.',starter:'',target:'print(8 + 5)',xp:10},
{id:5,world:'I · FIRST LIGHT',title:'Name the moon',prompt:'Create a variable called moon with the value "silver", then print it.',hint:'Assign first, print second.',starter:'',target:'moon = "silver"\nprint(moon)',xp:12},
{id:6,world:'II · ORBIT',title:'Growing signal',prompt:'Print *, **, *** and **** on four lines.',hint:'Use a loop and multiply the star string.',starter:'',target:'for i in range(1, 5):\n    print("*" * i)',xp:14},
{id:7,world:'II · ORBIT',title:'Count the orbit',prompt:'Print the numbers 1 through 5, each on its own line.',hint:'range stops just before its second number.',starter:'',target:'for i in range(1, 6):\n    print(i)',xp:14},
{id:8,world:'II · ORBIT',title:'Evening side',prompt:'Print only the even numbers from 2 through 10.',hint:'Step through range by two.',starter:'',target:'for i in range(2, 11, 2):\n    print(i)',xp:14},
{id:9,world:'II · ORBIT',title:'The hidden length',prompt:'Print the number of letters in "noctiluca".',hint:'len() measures a string.',starter:'',target:'print(len("noctiluca"))',xp:14},
{id:10,world:'II · ORBIT',title:'Reverse constellation',prompt:'Print "python" backwards.',hint:'A slice can walk backwards with ::-1.',starter:'',target:'print("python"[::-1])',xp:16},
{id:11,world:'III · UMBRA',title:'The threshold',prompt:'Print "open" if 7 is greater than 4.',hint:'A one-line if can follow the value.',starter:'',target:'if 7 > 4:\n    print("open")',xp:16},
{id:12,world:'III · UMBRA',title:'Smallest star',prompt:'Create a function called double that returns its input multiplied by 2.',hint:'Use def and return.',starter:'',target:'def double(n):\n    return n * 2',xp:18},
{id:13,world:'III · UMBRA',title:'A list of lights',prompt:'Print each color in ["red", "blue", "violet"] on its own line.',hint:'Loop over the list directly.',starter:'',target:'for color in ["red", "blue", "violet"]:\n    print(color)',xp:18},
{id:14,world:'III · UMBRA',title:'Count the vowels',prompt:'Print how many times "a" appears in "aurora".',hint:'Strings have a count method.',starter:'',target:'print("aurora".count("a"))',xp:18},
{id:15,world:'III · UMBRA',title:'The quiet total',prompt:'Print the sum of [3, 5, 8].',hint:'Python has a built-in for this.',starter:'',target:'print(sum([3, 5, 8]))',xp:18},
{id:16,world:'IV · ECLIPSE',title:'Fibonacci spark',prompt:'Print the first six Fibonacci numbers, starting with 0 and 1.',hint:'Keep two values and update them each loop.',starter:'',target:'a, b = 0, 1\nfor _ in range(6):\n    print(a)\n    a, b = b, a + b',xp:22},
{id:17,world:'IV · ECLIPSE',title:'Palindrome gate',prompt:'Print True if "level" reads the same backwards.',hint:'Compare a string with its reversed slice.',starter:'',target:'word = "level"\nprint(word == word[::-1])',xp:22},
{id:18,world:'IV · ECLIPSE',title:'Unique orbit',prompt:'Print the unique values from [2, 2, 5, 2, 8].',hint:'A set keeps each value once.',starter:'',target:'print(set([2, 2, 5, 2, 8]))',xp:22},
{id:19,world:'IV · ECLIPSE',title:'Prime signal',prompt:'Print True if 17 is prime.',hint:'Try divisors from 2 up to the square root.',starter:'',target:'n = 17\nprint(all(n % i for i in range(2, int(n ** 0.5) + 1)))',xp:24},
{id:20,world:'V · AFTERGLOW',title:'The final pattern',prompt:'Print a centered pyramid of stars with 4 rows.',hint:'Each row needs leading spaces and an odd number of stars.',starter:'',target:'for i in range(4):\n    print(" " * (3 - i) + "*" * (2 * i + 1))',xp:28}
];
