I've begun work on a [new project] and so far it's coming along nicely. I've been using some software at work to keep track of my hours, it's called office time. It works fine, simple interface, easy to manage for the most part, and at least 20 features I don't use. Ever. 

So being the kind of guy I am, I decided that I could probably make a simple to use task tracking utility. Here are some of my motivations. 

- I spend about 60-80% of my day in a terminal. So I should be able to access the utility from there
- I need to keep track of a task per day, and then be able to display it meaningfully later on
- I want to be able to add notes to myself about the task as I work on it
- I should only be active on a single task at a time


So let's see. I'm going to working in the command line, well that means I'll want an executable file. I could write a bash script, but bash syntax is not the best for anything complicated. So I want a higher language. I want to sit low, and I like C. So I'll do it in C. 

Keeping track of a single task, well that's simple. Give it a name. I'll have to be able to have it be permanent, and I even have a process running in the background (no) or I make an object of some kind in a file and use that to keep track of things. Now that sounds easy. If it works for git, it will work for me. If I want to keep track of my tasks per day, I should store these object files into their own folder, named after the current date. The benefit to this is that if I want to generate spreadsheets or information later on, I can do it by date with these folders.

Adding a note, well that's easy too, keep track of it in the file for the current task.

Being active on only a single task at a time? Now that seems hard to enforce. Because I'll be able to start a task, then end a task with a command. So I could fire off a bunch of tasks then finish them when I wanted to and the timing data would be complete garbage. Ah! So I'll keep track of the last created task in some type of master file. Easy! When a new task is created, the other task will be 'paused' or for starters I won't let a user switch tasks unless they finish one first. 


And this is my first plan. So far it's coming along and I've got the directory to hold this information all good and am writing out the usage documentation, as a guide to me and a guide to anyone else who wants to use it. 

[new project]:https://github.com/EdgeCaseBerg/timecatcher