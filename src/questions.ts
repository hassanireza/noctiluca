export type Question={id:number;world:string;title:string;prompt:string;hint:string;starter:string;target:string;test?:string;xp:number};
const openingQuestions:Question[]=[
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
{id:12,world:'III · UMBRA',title:'Smallest star',prompt:'Create a function called double that returns its input multiplied by 2.',hint:'Use def and return.',starter:'',target:'def double(n):\n    return n * 2',test:'print(double(6))',xp:18},
{id:13,world:'III · UMBRA',title:'A list of lights',prompt:'Print each color in ["red", "blue", "violet"] on its own line.',hint:'Loop over the list directly.',starter:'',target:'for color in ["red", "blue", "violet"]:\n    print(color)',xp:18},
{id:14,world:'III · UMBRA',title:'Count the vowels',prompt:'Print how many times "a" appears in "aurora".',hint:'Strings have a count method.',starter:'',target:'print("aurora".count("a"))',xp:18},
{id:15,world:'III · UMBRA',title:'The quiet total',prompt:'Print the sum of [3, 5, 8].',hint:'Python has a built-in for this.',starter:'',target:'print(sum([3, 5, 8]))',xp:18},
{id:16,world:'IV · ECLIPSE',title:'Fibonacci spark',prompt:'Print the first six Fibonacci numbers, starting with 0 and 1.',hint:'Keep two values and update them each loop.',starter:'',target:'a, b = 0, 1\nfor _ in range(6):\n    print(a)\n    a, b = b, a + b',xp:22},
{id:17,world:'IV · ECLIPSE',title:'Palindrome gate',prompt:'Print True if "level" reads the same backwards.',hint:'Compare a string with its reversed slice.',starter:'',target:'word = "level"\nprint(word == word[::-1])',xp:22},
{id:18,world:'IV · ECLIPSE',title:'Unique orbit',prompt:'Print the unique values from [2, 2, 5, 2, 8].',hint:'A set keeps each value once.',starter:'',target:'print(set([2, 2, 5, 2, 8]))',xp:22},
{id:19,world:'IV · ECLIPSE',title:'Prime signal',prompt:'Print True if 17 is prime.',hint:'Try divisors from 2 up to the square root.',starter:'',target:'n = 17\nprint(all(n % i for i in range(2, int(n ** 0.5) + 1)))',xp:24},
{id:20,world:'V · AFTERGLOW',title:'The final pattern',prompt:'Print a centered pyramid of stars with 4 rows.',hint:'Each row needs leading spaces and an odd number of stars.',starter:'',target:'for i in range(4):\n    print(" " * (3 - i) + "*" * (2 * i + 1))',xp:28}
];

const episodeNames=['FIRST LIGHT','ORBIT','UMBRA','ECLIPSE','AFTERGLOW','GRAVE GARDEN','GLASS TIDE','BLACK COMET','HOLLOW STAR','NIGHT ENGINE'];
const words=['raven','velvet','cipher','nebula','shadow','signal','winter','silver','lumen','midnight'];
const palette=['#a8c8bb','#a7b9cd','#b6a8c8','#c6a7a7','#c7b68e','#91b6b4','#c49cae','#99a9c8','#b4a9a0','#a8bd91'];
function makeQuestion(id:number):Question{
  const tier=Math.min(10,Math.ceil(id/100));
  const local=id%100;
  const n=2+(local*7)%31;
  const word=words[(local+tier)%words.length];
  const templates:Array<[string,string,string,string]>=[
    [`Print the word "${word}".`,`print("${word}")`,'Strings are text between quotes.','Output'],
    [`Print the result of ${n} multiplied by ${tier+2}.`,`print(${n} * ${tier+2})`,'Multiply with the * operator.','Arithmetic'],
    [`Print "${word}" backwards.`,`print("${word}"[::-1])`,'A slice can step backwards with ::-1.','String slicing'],
    [`Print the length of "${word}".`,`print(len("${word}"))`,'len() counts characters.','String length'],
    [`Print every number from 1 to ${Math.min(8,3+tier)}.`,`for i in range(1, ${Math.min(8,3+tier)+1}):\n    print(i)`,'range ends before its final value.','Loops'],
    [`Print only numbers divisible by ${2+(tier%4)} from 1 through ${Math.min(20,n)}.`,`for i in range(1, ${Math.min(20,n)+1}):\n    if i % ${2+(tier%4)} == 0:\n        print(i)`,'Use the remainder operator inside a loop.','Conditions'],
    [`Create a function called amplify that returns its input times ${tier+1}. Test it with ${n}.`,`def amplify(x):\n    return x * ${tier+1}\nprint(amplify(${n}))`,'Define a function, then call it.','Functions'],
    [`Print the sum of [${n}, ${n+2}, ${n+4}].`,`print(sum([${n}, ${n+2}, ${n+4}]))`,'sum() accepts a list of numbers.','Collections'],
    [`Print how many times "${word[0]}" appears in "${word}${word[0]}".`,`print("${word}${word[0]}".count("${word[0]}"))`,'Use the string count method.','String methods'],
    [`Print a ${Math.min(5,2+tier%4)}-row stair of stars.`,`for i in range(1, ${Math.min(5,2+tier%4)+1}):\n    print("*" * i)`,'Multiply a string by the row number.','Patterns']
  ];
  let [prompt,target,hint,topic]=templates[(local+Math.floor(id/10))%templates.length];
  if(tier>=3&&local%10===0){prompt=`Print the squares of ${n}, ${n+1}, and ${n+2}, one per line.`;target=`for x in range(${n}, ${n+3}):\n    print(x ** 2)`;hint='Loop across the values and use ** for powers.';topic='Powers';}
  if(tier>=4&&local%10===1){prompt=`Create a function named is_even that prints True for ${n} if it is even.`;target=`def is_even(x):\n    return x % 2 == 0\nprint(is_even(${n}))`;hint='Return the result of a remainder check.';topic='Boolean functions';}
  if(tier>=5&&local%10===2){prompt=`From [${n}, ${n+3}, ${n-1}, ${n+5}], print the largest value.`;target=`print(max([${n}, ${n+3}, ${n-1}, ${n+5}]))`;hint='max() finds the largest list item.';topic='List analysis';}
  if(tier>=6&&local%10===3){prompt=`Use a comprehension to print the cubes of 1 through ${Math.min(7,2+tier%6)}.`;target=`print([x ** 3 for x in range(1, ${Math.min(7,2+tier%6)+1})])`;hint='Put the expression before the for clause.';topic='Comprehensions';}
  if(tier>=7&&local%10===4){prompt=`Print the unique sorted values in [${n}, ${n+2}, ${n}, ${n-1}].`;target=`print(sorted(set([${n}, ${n+2}, ${n}, ${n-1}])))`;hint='Convert to a set, then sort it.';topic='Sets and sorting';}
  if(tier>=8&&local%10===5){prompt=`Write a recursive factorial function and print factorial(${Math.min(6,2+tier%5)}).`;const f=Math.min(6,2+tier%5);target=`def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\nprint(factorial(${f}))`;hint='The base case stops the recursion.';topic='Recursion';}
  if(tier>=9&&local%10===6){prompt=`Count the frequency of each character in "${word}" and print the dictionary.`;target=`counts = {}\nfor char in "${word}":\n    counts[char] = counts.get(char, 0) + 1\nprint(counts)`;hint='Use dict.get with a zero default.';topic='Frequency maps';}
  if(tier>=10&&local%10===7){prompt=`Build a ${Math.min(5,3+tier%3)}-row number triangle. Row n contains numbers 1 through n.`;const rows=Math.min(5,3+tier%3);target=`for row in range(1, ${rows+1}):\n    print(" ".join(str(n) for n in range(1, row + 1)))`;hint='Nest a join over a range inside the row loop.';topic='Nested patterns';}
  const lines=target.split('\n').length;
  if(lines>20)throw new Error(`Level ${id} exceeds the 20 line limit`);
  const episode=Math.ceil(id/20);
  return{id,world:`EPISODE ${String(episode).padStart(2,'0')} · ${episodeNames[(episode-1)%episodeNames.length]}`,title:`${topic}: trace ${String(id).padStart(3,'0')}`,prompt,hint,starter:'',target,xp:10+tier*2};
}
export const episodePalette=palette;
export const questions:Question[]=[...openingQuestions,...Array.from({length:980},(_,i)=>makeQuestion(i+21))];



