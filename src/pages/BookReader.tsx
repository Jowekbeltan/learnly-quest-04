import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, BookOpen, ChevronLeft, ChevronRight, Star, CheckCircle } from "lucide-react";
import { toast } from "sonner";

// Book content data structure
interface BookContent {
  id: string;
  title: string;
  author: string;
  subject: string;
  grade: string;
  rating: number;
  coverColor: string;
  chapters: {
    id: number;
    title: string;
    content: string;
  }[];
}

const bookContents: { [key: string]: BookContent } = {
  // Science Books
  sci1: {
    id: "sci1",
    title: "The Wonders of Space",
    author: "Dr. Sarah Chen",
    subject: "science",
    grade: "4-6",
    rating: 4.8,
    coverColor: "hsl(213 94% 68%)",
    chapters: [
      {
        id: 1,
        title: "Introduction to Our Solar System",
        content: `Welcome to the amazing journey through space! Our solar system is home to eight planets, countless moons, asteroids, and comets, all orbiting around our sun.\n\nThe Sun is the center of our solar system and provides light and heat to all the planets. It's so large that over one million Earths could fit inside it!\n\nThe planets are divided into two groups:\n• Inner Planets (Rocky): Mercury, Venus, Earth, and Mars\n• Outer Planets (Gas Giants): Jupiter, Saturn, Uranus, and Neptune\n\nEach planet is unique with its own characteristics, and in the following chapters, we'll explore what makes each one special.`
      },
      {
        id: 2,
        title: "The Inner Planets",
        content: `The inner planets are called rocky planets because they have solid surfaces.\n\nMercury is the closest planet to the Sun and the smallest planet. It has extreme temperatures - very hot during the day and freezing at night.\n\nVenus is often called Earth's twin because of similar size, but it's very different! It has thick clouds of acid and is the hottest planet.\n\nEarth is our home planet - the only one known to support life. It has water, oxygen, and the perfect conditions for living things.\n\nMars is called the Red Planet because of its rusty-red surface. Scientists are studying Mars to see if it once had water and possibly life.`
      },
      {
        id: 3,
        title: "The Gas Giants",
        content: `The outer planets are massive balls of gas with no solid surface to stand on!\n\nJupiter is the largest planet in our solar system. It has a famous red spot that's actually a giant storm larger than Earth! Jupiter has over 79 moons.\n\nSaturn is famous for its beautiful rings made of ice and rock. It's the second-largest planet and has at least 82 moons.\n\nUranus spins on its side, making it unique among planets. It appears blue-green due to methane in its atmosphere.\n\nNeptune is the windiest planet with storms reaching speeds of 1,200 mph! It's dark, cold, and far from the Sun.`
      },
      {
        id: 4,
        title: "Stars and Galaxies",
        content: `Stars are giant balls of hot gas that produce their own light and heat. Our Sun is actually a star!\n\nTypes of Stars:\n• Red Dwarfs: Small, cool stars that live very long\n• Yellow Stars: Medium-sized like our Sun\n• Blue Giants: Huge, hot, and very bright\n• Red Giants: Old, expanded stars\n\nGalaxies are massive collections of billions of stars. Our galaxy is called the Milky Way, and it contains over 200 billion stars!\n\nFun Fact: The light from distant stars takes years to reach Earth. When you look at stars, you're seeing them as they were in the past!`
      }
    ]
  },
  sci2: {
    id: "sci2",
    title: "Chemistry for Young Minds",
    author: "Prof. Michael Brown",
    subject: "science",
    grade: "5-6",
    rating: 4.6,
    coverColor: "hsl(213 94% 68%)",
    chapters: [
      {
        id: 1,
        title: "Matter and Its States",
        content: `Everything around you is made of matter! Matter is anything that has mass and takes up space.\n\nThe Three States of Matter:\n\n1. SOLID: Has a definite shape and volume. Particles are tightly packed together.\nExamples: Ice, wood, metal\n\n2. LIQUID: Has a definite volume but takes the shape of its container. Particles can move around.\nExamples: Water, juice, oil\n\n3. GAS: Has no definite shape or volume. Particles move freely and spread out.\nExamples: Air, steam, oxygen\n\nChanging States:\nMatter can change from one state to another! Ice (solid) melts into water (liquid), and water boils into steam (gas). These changes depend on temperature.`
      },
      {
        id: 2,
        title: "Elements and Atoms",
        content: `Atoms are the tiny building blocks of everything in the universe! They're so small that millions could fit on the head of a pin.\n\nParts of an Atom:\n• Protons: Positively charged particles in the nucleus\n• Neutrons: Neutral particles in the nucleus\n• Electrons: Negatively charged particles orbiting the nucleus\n\nElements are pure substances made of only one type of atom. There are 118 known elements!\n\nCommon Elements:\n• Oxygen (O): We breathe it\n• Carbon (C): Found in all living things\n• Hydrogen (H): Lightest element\n• Gold (Au): Precious metal\n• Iron (Fe): Makes steel\n\nThe Periodic Table organizes all the elements by their properties.`
      },
      {
        id: 3,
        title: "Chemical Reactions",
        content: `A chemical reaction happens when substances combine or break apart to form new substances!\n\nSigns of a Chemical Reaction:\n• Color change\n• Temperature change (hot or cold)\n• Gas bubbles form\n• Light is produced\n• New smell\n\nExamples of Chemical Reactions:\n\n1. Rust: Iron + Oxygen → Iron Oxide (rust)\n2. Baking: Baking soda + Vinegar → Carbon dioxide gas\n3. Burning: Wood + Oxygen → Ash + Smoke\n4. Photosynthesis: Carbon dioxide + Water + Sunlight → Sugar + Oxygen\n\nLaw of Conservation of Mass:\nMatter cannot be created or destroyed in a chemical reaction. Atoms are just rearranged into new combinations!`
      }
    ]
  },
  sci3: {
    id: "sci3",
    title: "The Amazing Human Body",
    author: "Dr. Emily Watson",
    subject: "science",
    grade: "3-5",
    rating: 4.9,
    coverColor: "hsl(213 94% 68%)",
    chapters: [
      {
        id: 1,
        title: "Body Systems Overview",
        content: `Your body is an amazing machine with many systems working together!\n\nMajor Body Systems:\n\n1. SKELETAL SYSTEM: 206 bones that support and protect your body\n\n2. MUSCULAR SYSTEM: Over 600 muscles that help you move\n\n3. CIRCULATORY SYSTEM: Heart and blood vessels that pump blood throughout your body\n\n4. RESPIRATORY SYSTEM: Lungs that help you breathe\n\n5. DIGESTIVE SYSTEM: Breaks down food for energy\n\n6. NERVOUS SYSTEM: Brain and nerves that control everything\n\nAll these systems work together to keep you healthy and active!`
      },
      {
        id: 2,
        title: "The Heart and Circulatory System",
        content: `Your heart is a powerful muscle that pumps blood throughout your body every second of every day!\n\nHow Your Heart Works:\n• Your heart beats about 100,000 times per day\n• It pumps about 2,000 gallons of blood daily\n• The heart has four chambers: two atria and two ventricles\n\nBlood Vessels:\n• ARTERIES: Carry oxygen-rich blood away from the heart\n• VEINS: Return blood to the heart\n• CAPILLARIES: Tiny vessels that connect arteries and veins\n\nWhat Blood Does:\n• Delivers oxygen to every cell\n• Removes carbon dioxide and waste\n• Carries nutrients from food\n• Fights infection with white blood cells\n• Helps control body temperature\n\nKeep Your Heart Healthy: Exercise regularly, eat nutritious foods, and get enough sleep!`
      },
      {
        id: 3,
        title: "The Brain and Nervous System",
        content: `Your brain is the control center of your body! It processes information and sends signals throughout your body.\n\nBrain Parts and Functions:\n\n• CEREBRUM: Largest part, controls thinking, memory, and voluntary movements\n• CEREBELLUM: Controls balance and coordination\n• BRAIN STEM: Controls automatic functions like breathing and heart rate\n\nThe Nervous System:\n• CENTRAL NERVOUS SYSTEM: Brain and spinal cord\n• PERIPHERAL NERVOUS SYSTEM: Nerves throughout your body\n\nHow It Works:\nNerves send electrical signals to and from your brain at speeds up to 268 miles per hour! This lets you react quickly to touch, temperature, and danger.\n\nAmazing Facts:\n• Your brain has about 86 billion neurons\n• It uses 20% of your body's energy\n• Different parts control different body functions\n• Your brain never stops working, even when you sleep!`
      }
    ]
  },
  math1: {
    id: "math1",
    title: "Numbers Come Alive",
    author: "Prof. Patricia Johnson",
    subject: "mathematics",
    grade: "1-3",
    rating: 4.9,
    coverColor: "hsl(25 95% 53%)",
    chapters: [
      {
        id: 1,
        title: "The Magic of Numbers",
        content: `Numbers are everywhere around us! They help us count, measure, and understand the world.\n\nLet's start with the basics:\n• Numbers 1-10 are the foundation of all math\n• Each number represents a quantity\n• We use numbers every day - counting toys, telling time, measuring ingredients!\n\nFun Fact: The number zero (0) is special - it means "nothing" but it's very important in math!\n\nPractice counting objects around your room. How many books do you have? How many windows? Counting is the first step to becoming a math wizard!`
      },
      {
        id: 2,
        title: "Addition Adventures",
        content: `Addition means putting things together! When we add, we combine groups to find out how many we have in total.\n\nThe plus sign (+) means "add" or "put together"\nThe equals sign (=) means "the same as"\n\nExample: 2 + 3 = 5\nThis means: 2 apples plus 3 apples equals 5 apples total!\n\nTips for Adding:\n• Start with the smaller number and count up\n• Use your fingers to help\n• Draw pictures to visualize\n\nTry this: If you have 4 crayons and your friend gives you 2 more, how many crayons do you have now? (Answer: 6!)`
      },
      {
        id: 3,
        title: "Subtraction Stories",
        content: `Subtraction means taking away! When we subtract, we remove items from a group.\n\nThe minus sign (-) means "take away"\n\nExample: 5 - 2 = 3\nThis means: 5 cookies minus 2 cookies eaten equals 3 cookies left!\n\nTips for Subtracting:\n• Start with the bigger number\n• Count backward\n• Use objects to help you see the problem\n\nPractice Problem: You have 7 balloons, but 3 fly away. How many balloons do you have left? (Answer: 4!)\n\nRemember: Subtraction is the opposite of addition!`
      },
      {
        id: 4,
        title: "Shapes and Patterns",
        content: `Shapes are all around us! Learning about shapes helps us understand geometry.\n\nBasic Shapes:\n• CIRCLE: Round with no corners (like a ball)\n• SQUARE: 4 equal sides and 4 corners (like a window)\n• TRIANGLE: 3 sides and 3 corners (like a pizza slice)\n• RECTANGLE: 4 sides, opposite sides are equal (like a door)\n\nPatterns:\nPatterns are things that repeat in a predictable way!\n\nExamples:\n• Red, Blue, Red, Blue, Red, Blue...\n• 2, 4, 6, 8, 10...\n• Circle, Square, Triangle, Circle, Square, Triangle...\n\nCan you find patterns in nature? Look at flower petals, honeycomb, or tree rings!`
      }
    ]
  },
  math2: {
    id: "math2",
    title: "Geometry in Nature",
    author: "Dr. Richard Taylor",
    subject: "mathematics",
    grade: "4-6",
    rating: 4.7,
    coverColor: "hsl(25 95% 53%)",
    chapters: [
      {
        id: 1,
        title: "Geometric Shapes in Nature",
        content: `Geometry is everywhere in nature! From honeycombs to snowflakes, nature uses geometric patterns.\n\nCircles in Nature:\n• Sun and moon appear circular\n• Tree rings grow in circles\n• Ripples in water form circles\n• Many flowers have circular patterns\n\nHexagons:\n• Honeycomb cells are perfect hexagons\n• Why? Hexagons use the least amount of wax while holding the most honey!\n• Snowflakes have six-sided (hexagonal) symmetry\n\nSpirals:\n• Seashells grow in spirals\n• Hurricanes form spiral patterns\n• Galaxies are spiral-shaped\n• Sunflower seeds arrange in spirals\n\nSymmetry:\nMany animals and plants show symmetry - if you draw a line down the middle, both sides match!`
      },
      {
        id: 2,
        title: "Measuring Angles",
        content: `An angle is formed when two lines meet at a point. We measure angles in degrees (°).\n\nTypes of Angles:\n\n• ACUTE ANGLE: Less than 90° (sharp, like a slice of pizza)\n• RIGHT ANGLE: Exactly 90° (like a square corner)\n• OBTUSE ANGLE: Between 90° and 180° (wide angle)\n• STRAIGHT ANGLE: Exactly 180° (a straight line)\n\nMeasuring Angles:\nWe use a protractor to measure angles. Place the center point on the vertex (where lines meet) and read the degree measurement.\n\nAngles in Real Life:\n• Clock hands form different angles\n• Ramps are inclined at specific angles\n• Buildings use right angles for stability\n• Artists use angles to create perspective\n\nPractice: Look around and identify different types of angles in your classroom!`
      },
      {
        id: 3,
        title: "Area and Perimeter",
        content: `Area and perimeter help us measure flat shapes.\n\nPERIMETER:\nThe distance around a shape. Add up all the sides!\n\nExample: A rectangle with sides 4 cm and 6 cm\nPerimeter = 4 + 6 + 4 + 6 = 20 cm\n\nAREA:\nThe amount of space inside a shape. Measured in square units.\n\nFormulas:\n• Rectangle: Area = length × width\n• Square: Area = side × side\n• Triangle: Area = (base × height) ÷ 2\n\nExample: A rectangle 5 cm long and 3 cm wide\nArea = 5 × 3 = 15 square cm\n\nReal-World Uses:\n• Calculating carpet needed for a room (area)\n• Measuring fence around a yard (perimeter)\n• Planning a garden layout\n• Determining paint needed for walls\n\nChallenge: Measure your bedroom and calculate its area!`
      }
    ]
  },
  tech1: {
    id: "tech1",
    title: "Coding for Beginners",
    author: "Alex Turner",
    subject: "technology",
    grade: "4-6",
    rating: 4.8,
    coverColor: "hsl(158 64% 52%)",
    chapters: [
      {
        id: 1,
        title: "What is Coding?",
        content: `Coding, also called programming, is like giving instructions to a computer. Just like you follow a recipe to bake cookies, computers follow code to perform tasks!\n\nWhy Learn to Code?\n• Create your own games and apps\n• Solve problems creatively\n• Understand how technology works\n• Prepare for future careers\n\nProgramming Languages:\nJust like humans speak different languages (English, Spanish, Chinese), computers understand different programming languages. Python is one of the easiest languages to start with!\n\nFun Fact: The first computer programmer was Ada Lovelace in the 1840s!`
      },
      {
        id: 2,
        title: "Your First Python Program",
        content: `Let's write your first line of code! In Python, we can make the computer display messages using the print() function.\n\nExample:\nprint("Hello, World!")\n\nThis tells the computer to show the text "Hello, World!" on the screen.\n\nTry It Yourself:\nprint("My name is [Your Name]")\nprint("I am learning to code!")\n\nVariables:\nVariables are like containers that store information.\n\nExample:\nname = "Alex"\nage = 12\nprint("My name is", name)\nprint("I am", age, "years old")\n\nVariables let you save and reuse information in your programs!`
      },
      {
        id: 3,
        title: "Making Decisions with Code",
        content: `Computers can make decisions using IF statements. This is like teaching the computer to think!\n\nIF Statement Structure:\nif condition:\n    do something\nelse:\n    do something different\n\nExample:\nage = 10\nif age >= 13:\n    print("You are a teenager!")\nelse:\n    print("You are a kid!")\n\nComparison Operators:\n• == (equals)\n• != (not equals)\n• > (greater than)\n• < (less than)\n• >= (greater than or equal)\n• <= (less than or equal)\n\nPractice: Write code that checks if a number is positive or negative!`
      },
      {
        id: 4,
        title: "Loops - Repeating Actions",
        content: `Loops let you repeat actions without writing the same code over and over!\n\nFOR Loop:\nUse when you know how many times to repeat.\n\nExample:\nfor i in range(5):\n    print("Hello!")\n\nThis prints "Hello!" 5 times.\n\nWHILE Loop:\nUse when you want to repeat until a condition is false.\n\nExample:\ncount = 0\nwhile count < 5:\n    print("Count is", count)\n    count = count + 1\n\nReal Uses of Loops:\n• Processing a list of names\n• Creating animation frames\n• Checking multiple test scores\n• Building game levels\n\nChallenge: Write a program that counts from 1 to 10!`
      }
    ]
  },
  tech2: {
    id: "tech2",
    title: "How Computers Work",
    author: "Sarah Mitchell",
    subject: "technology",
    grade: "3-5",
    rating: 4.7,
    coverColor: "hsl(158 64% 52%)",
    chapters: [
      {
        id: 1,
        title: "Computer Hardware Basics",
        content: `A computer has many parts that work together. Let's explore the main components!\n\nMajor Hardware Components:\n\n1. CPU (Central Processing Unit):\n• The "brain" of the computer\n• Processes all instructions\n• Measured in gigahertz (GHz)\n\n2. RAM (Random Access Memory):\n• Temporary storage for active programs\n• Like your desk workspace\n• More RAM = faster multitasking\n\n3. HARD DRIVE/SSD:\n• Permanent storage for files and programs\n• Like a filing cabinet\n• Stores data even when powered off\n\n4. MOTHERBOARD:\n• Connects all components together\n• Like the computer's nervous system\n\n5. INPUT DEVICES: Keyboard, mouse, microphone\n6. OUTPUT DEVICES: Monitor, speakers, printer\n\nAll these parts work together to make your computer function!`
      },
      {
        id: 2,
        title: "Software and Operating Systems",
        content: `Software is the instructions that tell hardware what to do. Without software, a computer is just a collection of parts!\n\nTypes of Software:\n\n1. OPERATING SYSTEM (OS):\n• Manages all computer resources\n• Examples: Windows, macOS, Linux, Chrome OS\n• Controls how programs interact with hardware\n\n2. APPLICATION SOFTWARE:\n• Programs you use for specific tasks\n• Examples: Web browsers, games, word processors\n\n3. SYSTEM SOFTWARE:\n• Helps computer run smoothly\n• Examples: Device drivers, utilities\n\nHow Software Works:\nSoftware is written in programming languages, then translated into binary code (1s and 0s) that the computer understands.\n\nBinary Code:\nComputers use only two digits: 0 and 1\n• 0 = OFF (no electricity)\n• 1 = ON (electricity flowing)\n\nEverything you see on your screen - text, images, videos - is stored as combinations of 0s and 1s!`
      },
      {
        id: 3,
        title: "How the Internet Works",
        content: `The Internet connects billions of computers worldwide! Let's understand how it works.\n\nWhat is the Internet?\n• A massive network of connected computers\n• Allows information sharing globally\n• Uses cables, satellites, and wireless signals\n\nHow Data Travels:\n\n1. You type a website address (URL)\n2. Your computer sends a request\n3. Data travels through routers and servers\n4. The website's server responds\n5. Information travels back to you\n6. Your browser displays the webpage\n\nAll of this happens in milliseconds!\n\nKey Concepts:\n\n• IP ADDRESS: Unique number identifying each device (like a home address)\n• ROUTER: Device that directs internet traffic\n• SERVER: Powerful computer that stores websites and data\n• BROWSER: Program that displays webpages (Chrome, Safari, Firefox)\n• BANDWIDTH: How much data can travel at once\n\nThe Internet has revolutionized how we learn, communicate, and share information!`
      }
    ]
  },
  lang1: {
    id: "lang1",
    title: "English Grammar Made Easy",
    author: "Prof. Margaret Wilson",
    subject: "languages",
    grade: "3-6",
    rating: 4.7,
    coverColor: "hsl(262 83% 68%)",
    chapters: [
      {
        id: 1,
        title: "Parts of Speech",
        content: `Words are the building blocks of language! Every word belongs to a category called a "part of speech."\n\nThe 8 Parts of Speech:\n\n1. NOUN: Person, place, thing, or idea\nExamples: teacher, school, book, happiness\n\n2. PRONOUN: Replaces a noun\nExamples: he, she, it, they, we\n\n3. VERB: Action or state of being\nExamples: run, jump, is, was\n\n4. ADJECTIVE: Describes a noun\nExamples: big, blue, happy, tall\n\n5. ADVERB: Describes a verb, adjective, or other adverb\nExamples: quickly, very, too, well\n\n6. PREPOSITION: Shows relationship between words\nExamples: in, on, under, with\n\n7. CONJUNCTION: Connects words or phrases\nExamples: and, but, or, because\n\n8. INTERJECTION: Shows emotion\nExamples: Wow! Oh! Yay!\n\nPractice identifying parts of speech in sentences you read!`
      },
      {
        id: 2,
        title: "Sentence Structure",
        content: `A sentence expresses a complete thought. Every sentence needs at least two things: a subject and a predicate.\n\nSentence Parts:\n\n• SUBJECT: Who or what the sentence is about\nExample: "The cat" in "The cat sleeps."\n\n• PREDICATE: What the subject does or is\nExample: "sleeps" in "The cat sleeps."\n\nTypes of Sentences:\n\n1. DECLARATIVE: Makes a statement (ends with .)\n"The sky is blue."\n\n2. INTERROGATIVE: Asks a question (ends with ?)\n"What is your name?"\n\n3. IMPERATIVE: Gives a command (ends with . or !)\n"Close the door."\n\n4. EXCLAMATORY: Shows strong emotion (ends with !)\n"What a beautiful day!"\n\nSentence Structure Levels:\n\n• SIMPLE: One independent clause\n"I like pizza."\n\n• COMPOUND: Two independent clauses joined\n"I like pizza, but she prefers pasta."\n\n• COMPLEX: Independent clause + dependent clause\n"I will go if you come with me."\n\nGood writing uses a variety of sentence types and structures!`
      },
      {
        id: 3,
        title: "Punctuation Rules",
        content: `Punctuation marks are like traffic signals for reading! They tell us when to pause, stop, or show emotion.\n\nEssential Punctuation Marks:\n\n1. PERIOD (.)\n• Ends a statement\n• Used in abbreviations (Dr., Mr.)\n\n2. QUESTION MARK (?)\n• Ends a question\n"Where are you going?"\n\n3. EXCLAMATION POINT (!)\n• Shows strong feeling\n"Watch out!"\n\n4. COMMA (,)\n• Separates items in a list\n• Creates pauses in sentences\n"I bought apples, oranges, and bananas."\n\n5. APOSTROPHE (')\n• Shows possession: "Sarah's book"\n• Makes contractions: "don't" (do not)\n\n6. QUOTATION MARKS (" ")\n• Shows someone's exact words\n"I'm hungry," she said.\n\n7. COLON (:)\n• Introduces a list or explanation\n"You'll need: pencil, paper, eraser."\n\n8. SEMICOLON (;)\n• Connects related sentences\n"She studied hard; she passed the test."\n\nProper punctuation makes your writing clear and professional!`
      }
    ]
  },
  lit2: {
    id: "lit2",
    title: "Charlotte's Web",
    author: "E.B. White",
    subject: "literature",
    grade: "3-5",
    rating: 5.0,
    coverColor: "hsl(340 75% 60%)",
    chapters: [
      {
        id: 1,
        title: "About the Story",
        content: `"Charlotte's Web" is a beloved classic about friendship, love, and sacrifice. Published in 1952, it has touched the hearts of millions of readers.\n\nMain Characters:\n\n• WILBUR: A lovable pig who fears being slaughtered\n• CHARLOTTE: A wise and kind spider who becomes Wilbur's best friend\n• FERN: A young girl who initially saves Wilbur's life\n• TEMPLETON: A gluttonous rat who helps reluctantly\n\nSetting:\nThe story takes place on a farm in rural America, mainly in the barn where the animals live.\n\nThemes:\n• The power of friendship\n• Life and death\n• Loyalty and sacrifice\n• Growing up\n• The cycle of life\n\nWhy This Book Matters:\nE.B. White created characters that feel real and emotions that resonate with readers of all ages. The story teaches important lessons about compassion, friendship, and accepting change.`
      },
      {
        id: 2,
        title: "Story Summary - Part 1",
        content: `The Beginning:\n\nFern Arable lives on a farm where a litter of pigs is born. When she learns her father plans to kill the runt pig, Fern begs him to spare its life. Her father agrees, and Fern names the pig Wilbur.\n\nFern raises Wilbur like a baby, feeding him with a bottle and taking him everywhere in a carriage. But as Wilbur grows, Fern's father insists he must be sold.\n\nWilbur is sold to Fern's uncle, Homer Zuckerman, and moves to a barn down the road. Fern visits often, but Wilbur feels lonely in his new home.\n\nMeeting Charlotte:\n\nOne night, Wilbur hears a voice offering friendship. The voice belongs to Charlotte, a large gray spider who lives in the barn doorway. Despite his initial fear of spiders, Wilbur and Charlotte become best friends.\n\nThe animals in the barn tell Wilbur about what happens to pigs when winter comes - they are slaughtered for food. Wilbur is terrified, but Charlotte promises, "I will save you."`
      },
      {
        id: 3,
        title: "Story Summary - Part 2",
        content: `Charlotte's Plan:\n\nCharlotte hatches an ingenious plan to save Wilbur. She weaves words into her web, starting with "SOME PIG." When people see the miraculous web, they believe Wilbur is special and worth saving.\n\nOver time, Charlotte weaves more messages:\n• "TERRIFIC"\n• "RADIANT"\n• "HUMBLE"\n\nNews of the miraculous pig spreads, and people come from far and wide to see Wilbur and the web. Mr. Zuckerman decides to take Wilbur to the County Fair.\n\nAt the Fair:\n\nAt the fair, Charlotte weaves her final word: "HUMBLE." Wilbur wins a special prize, ensuring his life will be spared. However, Charlotte is weak and tired.\n\nThe Bittersweet Ending:\n\nCharlotte lays her eggs in a sac but knows she won't live to see her babies hatch. She tells Wilbur goodbye, and he is heartbroken.\n\nWilbur takes Charlotte's egg sac back to the barn. In spring, Charlotte's babies hatch. Most fly away, but three stay with Wilbur, becoming his friends. While no one can replace Charlotte, her legacy of friendship lives on.\n\nThe Final Lesson:\nThe story reminds us that true friendship never dies, even when our loved ones are gone.`
      }
    ]
  },
  social1: {
    id: "social1",
    title: "World Geography Atlas",
    author: "Dr. Robert Turner",
    subject: "socialstudies",
    grade: "4-6",
    rating: 4.8,
    coverColor: "hsl(45 86% 58%)",
    chapters: [
      {
        id: 1,
        title: "Understanding Maps and Globes",
        content: `Maps and globes help us understand our world! They show us where places are located and how to get from one place to another.\n\nMaps vs. Globes:\n\n• GLOBE: A round model of Earth\n  - Shows Earth's true shape\n  - Shows accurate distances and directions\n  - Hard to carry around!\n\n• MAP: A flat representation of Earth\n  - Easy to use and carry\n  - Can show details of small areas\n  - Some distortion due to flattening\n\nMap Components:\n\n1. TITLE: Tells what the map shows\n2. COMPASS ROSE: Shows directions (N, S, E, W)\n3. SCALE: Shows how distances on the map relate to real distances\n4. LEGEND/KEY: Explains symbols used on the map\n5. LATITUDE & LONGITUDE: Grid lines for locating places\n\nTypes of Maps:\n• Physical maps: Show natural features (mountains, rivers)\n• Political maps: Show countries and borders\n• Climate maps: Show weather patterns\n• Road maps: Show highways and streets\n\nPractice reading maps to become a geography expert!`
      },
      {
        id: 2,
        title: "The Seven Continents",
        content: `Earth has seven continents, each unique with different climates, cultures, and wildlife!\n\nThe Seven Continents:\n\n1. ASIA (Largest)\n• 48 countries including China, India, Japan\n• Home to 60% of world population\n• Has highest (Mt. Everest) and lowest (Dead Sea) points\n\n2. AFRICA\n• 54 countries\n• Sahara Desert is world's largest hot desert\n• Amazing wildlife: lions, elephants, giraffes\n\n3. NORTH AMERICA\n• 23 countries including USA, Canada, Mexico\n• Rocky Mountains and Great Plains\n• Diverse climates from Arctic to tropical\n\n4. SOUTH AMERICA\n• 12 countries including Brazil, Argentina\n• Amazon Rainforest - world's largest\n• Andes Mountains run along west coast\n\n5. ANTARCTICA (Coldest)\n• No permanent human residents\n• Covered in ice and snow\n• Important for scientific research\n\n6. EUROPE\n• 44 countries\n• Rich history and diverse cultures\n• Many famous landmarks and cities\n\n7. AUSTRALIA/OCEANIA (Smallest)\n• Includes Australia, New Zealand, Pacific Islands\n• Unique wildlife: kangaroos, koalas\n• Great Barrier Reef\n\nEach continent has its own special features that make our world diverse and interesting!`
      },
      {
        id: 3,
        title: "Oceans and Water Bodies",
        content: `Water covers about 71% of Earth's surface! Oceans, seas, lakes, and rivers are essential for life.\n\nThe Five Oceans:\n\n1. PACIFIC OCEAN (Largest)\n• Covers more area than all land combined\n• Deepest point: Mariana Trench (36,000 feet)\n• Home to thousands of islands\n\n2. ATLANTIC OCEAN\n• Second largest\n• Separates Americas from Europe and Africa\n• Important for trade and travel\n\n3. INDIAN OCEAN\n• Third largest\n• Warmest ocean\n• Important for shipping routes\n\n4. SOUTHERN OCEAN\n• Surrounds Antarctica\n• Cold, stormy waters\n• Rich in marine life\n\n5. ARCTIC OCEAN (Smallest)\n• Mostly covered by ice\n• Located at North Pole\n• Home to polar bears and seals\n\nImportance of Oceans:\n• Produce over half of Earth's oxygen\n• Regulate climate and temperature\n• Provide food and resources\n• Support transportation and trade\n• Home to incredible biodiversity\n\nOther Water Bodies:\n• SEAS: Smaller than oceans, often partially enclosed\n• LAKES: Inland bodies of water\n• RIVERS: Flowing water that connects to seas/oceans\n• GULFS & BAYS: Partially enclosed coastal waters\n\nProtecting our water bodies is essential for a healthy planet!`
      }
    ]
  }
};

const BookReader = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  const [currentChapter, setCurrentChapter] = useState(0);
  const [completedChapters, setCompletedChapters] = useState<number[]>([]);

  const book = bookId ? bookContents[bookId] : null;

  if (!book) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-16">
          <div className="container text-center">
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Book Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This book is not available yet. More content coming soon!
            </p>
            <Button onClick={() => navigate("/library")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Library
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const chapter = book.chapters[currentChapter];
  const progress = ((completedChapters.length + (currentChapter === book.chapters.length - 1 && completedChapters.includes(currentChapter) ? 0 : 0)) / book.chapters.length) * 100;

  const handleNextChapter = () => {
    if (currentChapter < book.chapters.length - 1) {
      if (!completedChapters.includes(currentChapter)) {
        setCompletedChapters([...completedChapters, currentChapter]);
        toast.success("Chapter completed!");
      }
      setCurrentChapter(currentChapter + 1);
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const handleCompleteBook = () => {
    if (!completedChapters.includes(currentChapter)) {
      setCompletedChapters([...completedChapters, currentChapter]);
    }
    toast.success(`Congratulations! You've finished "${book.title}"!`, {
      description: "Keep learning and explore more books in the library."
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="container max-w-4xl">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate("/library")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>

          {/* Book Header */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div 
                    className="h-20 w-16 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: book.coverColor }}
                  >
                    <BookOpen className="h-8 w-8 text-white/80" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-1">{book.title}</CardTitle>
                    <p className="text-muted-foreground">by {book.author}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="secondary">Grade {book.grade}</Badge>
                      <Badge variant="outline" className="capitalize">{book.subject}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-warning text-warning" />
                        <span className="text-sm font-medium">{book.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Reading Progress</span>
                  <span className="font-medium">
                    {completedChapters.length} / {book.chapters.length} chapters
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Chapter Navigation */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="outline"
              onClick={handlePreviousChapter}
              disabled={currentChapter === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Chapter {currentChapter + 1} of {book.chapters.length}
              </p>
            </div>
            <Button
              onClick={currentChapter === book.chapters.length - 1 ? handleCompleteBook : handleNextChapter}
              disabled={currentChapter === book.chapters.length - 1 && completedChapters.includes(currentChapter)}
            >
              {currentChapter === book.chapters.length - 1 ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Book
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>

          {/* Chapter Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {completedChapters.includes(currentChapter) && (
                  <CheckCircle className="h-5 w-5 text-success" />
                )}
                {chapter.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {chapter.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BookReader;
