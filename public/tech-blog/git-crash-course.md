###The Terminal and You


Your terminal is your entrance to the world of your computer's innards. You can
do everything you can do through your GUI (Graphical User Interface), but without
needing a mouse to do so. Some people may find it archaeic but really, there's no
substitute for a good terminal when it comes to manuevering on a server or managing
a tool like git. 

Here are some basics
######Note that a $ indicates we're typing into the command prompt

Some basic commands

<table>
    <thead>
      <tr><th>Command</th><th>What it means</th></th><th>Description</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><pre>$pwd</pre></td>
        <td>Print working Directory</td>
        <td>This lets you know where you are</td>
      </tr>
      <tr>
        <td><pre>$ls</pre></td>
        <td>List Directory</td>
        <td>This lists out the files in the current directory.</td>
      </tr>
      <tr>
        <td><pre>$cd</pre></td>
        <td>Change Directory</td>
        <td>Your navigation tool, type this and the name of a directory your current folder and you'll be there</td>
      </tr>
      <tr>
        <td><pre>$nano</pre></td>
        <td>Nano Text editor</td>
        <td>Opens up the terminal text editor nano. Use ctrl-o to save files and ctrl-x to quit</td>
      </tr>
      <tr>
        <td><pre>$vi</pre></td>
        <td>Vi/Vim text editor</td>
        <td>Another text editor that works in mode and has lots of good features</td>
      </tr>
      <tr>
        <td><pre>$touch</pre></td>
        <td>Change file timestamps</td>
        <td>This command is commonly used to create empty files, but is also used to update timestamps</td>
      </tr>
      <tr>
        <td><pre>$mkdir</pre></td>
        <td>Make Directory</td>
        <td>This command lets you create directories, just say mkdir foldername and you'll have your folder</td>
      </tr>
    </tbody>
  </table> 


With those basic commands you should be able to get by in the terminal without too much trouble. Here are some 
examples of using those commands for your reference:

######Note that I'm showing the output of each command on the next line down, And that a # in the command means just a comment, just my note to you
 <pre>
 $pwd
 /home/ethan
 $ls
 Desktop Downloads Pictures Public Themes Videos Documents Music Programming
 $cd Programming/
 C Grails Java Open-Source Python Ruby scripts Web Work
 $cd ../ #../ means go up a directory, you can chain these like ../../ to move up 2 directories
 $ls
 Desktop Downloads Pictures Public Themes Videos Documents Music Programming tmp.txt
 $touch tmp.txt #Create a file called tmp.txt that's blank
 $vi tmp.txt
 #Vim would open here and I would edit the file, then use esc + : + wq to write and save it
 $nano tmp.txt
 #nano would open here and I would edit the file, then use ctrl+o ctrl+x to write and save
 $cd Programming/C/xemark/ #You can do all the changes at once if you know where you're going
 $ls
 a.out  constants.h  example.xe  functions.h  grammar.html  Grammar.xe  LICENSE  mark-server  parser.c  README.md  xemark
 $cd #cd with no directory will bring you back to your home directory
 $ls
 Desktop Downloads Pictures Public Themes Videos Documents Music Programming tmp.txt
 </pre>

This is a pretty minimal example of showing some of the functionality, each of the commands can take arguments and if you'd like
to see them then you can typically type the name of the command followed by a -h or --help to get some information. There's also always the manual pages which you can get to with <pre>$man command</pre>

###Getting to Git
===============================================

Git is a fantastic version control system (VCS) designed to manage source code efficiently. It was created by the same man who created
the Linux Kernal and is used by him to maintain over 2000 developers over the world working on it. It can also be used by graphic
designers to avoid the mess of folders you might use to keep track of different versions. Just create a git repository in your 
folder and start working, when you're happy with what you have, commit. Then continue working. If you don't like what you did, you
can always revert the folder to exactly the same state as it was before you made your changes. The following section will let you
know how to accomplish all of this.

###The basics

A repository is a fancy word for a folder that is under version control. Git is a distributed VCS, which means that there is no
primary or central repository for a project. But rather, each person working on the project has their own local version of the files.
All of these files are kept up to date with each other by each person pushing and pulling their files to and from other people's repositories. When using github, it's easy to fall into a hybrid of distributed and centralized workflows for VCS.

Here's what I mean; I maintain a repository on github for a project I'm working on. You come along and like what you see and decide to help out. You pop open my issue tracker and notice something you know how to fix. To get a copy of my repository you "fork" me on github. This brings a copy of the files on github into a repository associated with your account. Next, you "pull" my files onto your local machine, make your changes, "commit" and then "push" them back up to your repository. At this point, you open what's called a "pull request" to my repository from yours. This let's me know that you want me to "pull" the changes you've made and integrate them into my "upstream" repository.

Ok, so that's a whole lot of terminology in one use case. So let's break it down a bit.

<table>
    <thead>
      <tr>
        <th>Term</th>
        <th>English</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>fork</td>
        <td>A copy of another repository</td> 
      </tr>
      <tr>
        <td>pull</td>
        <td>The act of taking changes from another repository and merging them to yours</td>
      </tr>
      <tr>
        <td>push</td>
        <td>The act of making changes from your local repository to another one that you have access to</td>
      </tr>
      <tr>
        <td>commit</td>
        <td>Save the state of your repository at that point and make a note about where you are</td>
      </tr>
      <tr>
        <td>upstream</td>
        <td>If you forked your repository from someone else, then typically you refer to the repository being forked as upstream</td>
      </tr>
      <tr>
        <td>pull request</td>
        <td>If you can't push changes directory to a repository, then you have to ask the owner of the repository to pull from you.</td>
      </tr>
      <tr>
        <td>remote</td>
        <td>A remote is a repository not on your machine, but somewhere else like a server</td>
      </tr>
    </tbody>
  </table>


This is not an exhaustive table, there's a lot to git but the basics are simple. You work on a project, add the changes, and when you're happy with what you have, you commit them. So let's look at a use case of creating a local repository:

 <pre>
 $pwd 
 /home/ethan/
 $mkdir example
 $cd example/
 $git init
 Initialized empty Git repository in /home/ethan/example/.git/
 $touch file.txt
 $git status
 # On branch master
 #
 # Initial commit
 #
 # Untracked files:
 #   (use "git add <file>..." to include in what will be committed)
 #
 # file.txt
 nothing added to commit but untracked files present (use "git add" to track)
 $git add file.txt
 $git status -sb #this is just a short status view so this page doesn't get long
 ## Initial commit on master
 A  file.txt
 $git commit
 # Please enter the commit message for your changes. Lines starting
 # with '#' will be ignored, and an empty message aborts the commit.
 # On branch master
 #
 # Initial commit
 #
 # Changes to be committed:
 #   (use "git rm --cached <file>..." to unstage)
 #
 #       new file:   file.txt
</pre>
 At this point you should have either nano or vi open, type in a commit message and save. 
 (if you need a guide on how to save, look at the command reference again at the top of the page)
 My commit message below:
<pre>
 Added an example file named file.txt
 This is a super exciting commit message that details everything
 that I've done in this commit that way people can tell what I did!
 # Please enter the commit message for your changes. Lines starting...
 [master (root-commit) ed51ab3] Added an example file named file.txt
 0 files changed
 create mode 100644 file.txt
 </pre>

Congrats, if you followed along with those commands you've just made your first repository,
added a file to it, and commited it. It's not that hard. Let's take a few of the important 
pieces out first:
 <pre>$git init</pre>
This is the command that gets everything rolling when you're starting a new project. It creates a repository in your current working directory. What this really means, is that you now have a hidden folder called .git that contains all the information about the files you're tracking. 

The next git command we ran across was <pre>$git status</pre> which, in case you haven't guessed lets you know what the current status of your repository is. If we had executed the command before creating the file we would have been told that our working directory was clean and that nothing much has happened. But when you're actually doing things, you end up with a good lengthy output of all the files that have been added, deleted, moved, or staged. If you don't want to see all the help text, you can pass the -sb argument to the status command and it will output just the bare minimum. We did this in our second status, and you can see the large capital A next to file.txt that indicates we Added the file to the repository. 

I just mentioned adding, deleting and moving. All of which should be familiar concepts to anyone whose ever used a computer. But staging is something most people don't hear. We're in version control jargon now. When a file is staged, that means that the next time we commit, the changes to the file (being created is a change!) will be recorded in the repositories history. We're effectively saving a snapshot of the files when we commit a staged file. If you don't stage your files using the <pre>$git add filename</pre> command then you won't commit your changes. Don't commit your changes and you run the risk of losing work if you change a bunch of things then can't undo it. If you'd like, you can think of git commits as placeholders in your Ctrl-Z history for files. 

The last thing I want to touch on is the commit message. When you're first starting out with git, it's very easy to use this command <pre>$git commit -am "Did some stuff!"</pre>This command adds all the files in your directory to the repository, stages them, then commits them with a message of "Did some stuff!". Now this is all well and good when you're starting out. But. Here's the problem. When you type out longer messages using the -m "" format, the entire commit message is on the one line. Why should you care about this? Becuase when you work in a group of people it's important to have a record of what happened, and when you look at something 3 months down the road from now, you'll see a message like "Added that thing Jeff asked for" and you'll have no idea what you were talking about. So, use a text editor for commits that need detail and avoid the -m syntax. Your collaborators will appreciate it, and so will you if you run the gitk command and look at your repository history.

Our next case is renaming a file. Normally you'd do this through your fancy graphical interface. Not today. Trust me though, there's a reason. 
 <pre>
 $git mv file.txt renamedfile.txt
 $git status -sb
 ## master
 R  file.txt -> renamedfile.txt
 $git commit #(Do your commit message here to save renaming that file)
 </pre>

The mv command moves a file, oddly enough moving a file and renaming a file are actually the same thing. Funny how computers work right? Similarally, the command "git mv" moves a file within a repository. So why should you move the file using git mv and not just mv? Let me show you:

 <pre>
 #the result of my commit:
 [master 2a1b3ff] Renamed file to renamedfile
 1 file changed, 0 insertions(+), 0 deletions(-)
 rename file.txt => renamedfile.txt (100%)
 
 $mv renamedfile.txt silly.txt
 $git status 
 # On branch master
 # Changes not staged for commit:
 #   (use "git add/rm <file>..." to update what will be committed)
 #   (use "git checkout -- <file>..." to discard changes in working directory)
 #
 # deleted:    renamedfile.txt
 #
 # Untracked files:
 #   (use "git add <file>..." to include in what will be committed)
 #
 # silly.txt
 no changes added to commit (use "git add" and/or "git commit -a")
 </pre>

 Well then. According to git we've deleted our file named renamedfile.txt and there's a new file that we haven't added to our repository yet named silly.txt

See anything wrong with this? Let me point it out. If you're trying to keep track of changes to a file over the course of a repository history (you know, so you can undo them if you have to) then having a file marked as deleted is going to make that dream come to a grinding halt. There's no way for git to know that you haven't created a new file named silly.txt, after all moving a file is the same as renaming it, and when you move a file that's basically saying it doesn't exist anymore at the old location and now exists at the new. So you can see why git would track this as a deletion.


Pedantry aside, we can undo what we just did with git
 <pre>
 $git reset HEAD
 Unstaged changes after reset:
 D renamedfile.txt
 $git status -sb
 ## master
 D renamedfile.txt
 ?? silly.txt
 $rm silly.txt
 </pre>

So we've undeleted our file by reseting the HEAD of our repository. The HEAD of our repository is like a finger that points at the current changes in our repository. There's a more technical explanation for it, but you can google for that since it's not that important right now. Also, you might notice that when we did our status, we had two files in our repository. Why's that? Becuase git wasn't tracking silly.txt so of course it wouldn't remove the file when we reset the head. Files you don't add to the repository with git are left alone.


We've unstaged the changes to our repository, but you'll notice that if you list directory then you'll see that your file still doesn't actually exist. To get it back, we need to checkout the file. This will undo the changes we've done (deleting the file) and if we list our directory again we'll have our file back.
 <pre>
 $git checkout renamedfile.txt
 $ls
 renamedfile.txt
 </pre>


 Alright, so we've made a repository in git. We've added, staged, and deleted files from it. We've renamed a file and made two commits. Now let's utilize some of the power that git offers us through version control. Let's run the command <pre>gitk</pre>

 After a moment a big gray window will open up. Welcome to the repository viewer that ships with git. In the top left corner we have our git log, which includes all our commits. You'll notice that the first line of your commit will be shown here. This is one of the reasons why I emphasize good commit messages like I described above. To the right of the log you'll see a column for authors and timestamps. Each of these logically matches up with the commit that was authored at that particular time.


 Click one of the commits. Specifically, the first one. The bottom windows are now full of information. The right hand side lists the files changed, and if you click on one of those files the changes that occured will show up in the left pane. Additions to files will show up in green, and deletions will show up in red. You'll also see your full commit message if you look at the top of the left pane, or click the comments line on the right pane. 


 Looking directly underneath the top left pane, you'll see a SHA1 ID identifier followed by a bunch of numbers. This is a hash. And is how you can identify each commit. Close gitk now and open your terminal. It's great  to see the full history of your git repository, but for now all we need is the log. 
  <pre>
  $git log --oneline
   2a1b3ff Renamed file to renamedfile
   ed51ab3 Added an example file named file.txt
  </pre> 
Note that the hashes at the beginning of each line might be different on your machine. Anyway, let's go ahead and decide that we didn't really want to rename the file, and we want to change it back. If we weren't using version control we'd rename the file ourselves. But let's go ahead and use git to revert our file back to what it once was. There's two ways we can do this. We can use git reset like this:
 <pre>
  $git reset ed51ab3
  Unstaged changes after reset:
  D file.txt
  git status -sb
  ## master
  D file.txt
  ?? renamedfile.txt
  $rm renamedfile.txt
  $git checkout file.txt
  $ls
  file.txt
 </pre>
 or we can use git reset like this
 <pre>
 $git reset --hard ed51ab3
  HEAD is now at ed51ab3 Added an example file named file.txt
 </pre>

 What's the difference? Well, if we just run git reset we're performing a "soft" reset, which allows the changes we've done to still exist in the repository, but just not be commited anymore. This is good for when you've made some changes, commited, then realized you forgot to do one thing and you want to add it on within the last commit. The second, which performs a hard reset, discards the changes done in the commits after ed51ab3 and sets us right to where we were at that snapshot.
 

What about if we didn't really mean to reset at all and we want our commit back? We can do this too. Let's say we go back on un-renaming the file (we're so wishy washy). Because we have the hash from the log, (2a1b3ff in my case) we can redo our changes by doing the following:
 <pre>
 $git checkout 2a1b3ff
 Note: checking out '2a1b3ff'. 
 You are in 'detached HEAD' state. You can look around, make experimental
 changes and commit them, and you can discard any commits you make in this
 state without impacting any branches by performing another checkout.
 If you want to create a new branch to retain commits you create, you may
 do so (now or later) by using -b with the checkout command again. Example:
  git checkout -b new_branch_name
 HEAD is now at 2a1b3ff... Renamed file to renamedfile
 $git branch tmp
 $git checkout master
 Previous HEAD position was 2a1b3ff... Renamed file to renamedfile
 Switched to branch 'master'
 $git merge tmp
 Updating ed51ab3..2a1b3ff
 Fast-forward
  file.txt => renamedfile.txt |    0
  1 file changed, 0 insertions(+), 0 deletions(-)
  rename file.txt => renamedfile.txt (100%)
 $git branch -d tmp
 Deleted branch tmp (was 2a1b3ff).
 $git log --oneline
 2a1b3ff Renamed file to renamedfile
 ed51ab3 Added an example file named file.txt
 </pre>
Alright, so we've hit on some new commands. First off, we used git checkout to make our repository be like the snapshot that is in commit 2a1b3ff (which is after we renamed the file), we were in something called a detached HEAD state. This just means that we've grabbed our snapshot and we're not currently tracking any history for what we do. Git kindly informs us that if we want to commit and make changes, we can create a new branch and switch to it with the command git checkout -b new_branch_name. Because we're not making any changes, we use the git branch name_of_branch(in our case tmp) to create a branch based on our current commit (2a1b3ff) and then we switch branches to our master branch (the one we've been working on this whole time). 

To remind you, each branch is like a different version of our repository, so we now have two versions of our repository, we have master and tmp, one has the renamed files we want and the other is the branch we reset. To merge the two together, specifically, merge the changes of tmp onto master. We move to the master branch with git checkout master, and then we use git merge tmp to merge the tmp branch onto master. Straightforward right? To clean up our repository we then use git branch -d tmp to delete the old branch we're not using anymore. This is generally a good idea, if you're merged a branch in, then it makes perfect sense to remove it.


###Working with remotes


So we've learned how to manage our local repository. Now let's learn how to use git to collaborate with others. Go ahead and setup an account on github, and [then follow the excellent instructions]  on how to setup your ssh keys with github. 

[then follow the excellent instructions]:https://help.github.com/articles/generating-ssh-keys 

Once you've done this, create a repository on github (I'll call mine example) and DONT initialize it with a readme. Github will inform you on how to setup your remotes but I'll reiterate it here anyway. Note that your github url's will be different
 <pre>
git remote add origin git@github.com:your_github_username_here/example.git
git push -u origin master
Counting objects: 5, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (2/2), done.
Writing objects: 100% (5/5), 576 bytes, done.
Total 5 (delta 0), reused 0 (delta 0)
To git@github.com:your_username_here/example.gitthe
 * [new branch]      master -> master
Branch master set up to track remote branch master from origin.
 </pre>

If you messed typing your repository url in, then you can this command to help: 
 <pre>
git remote set-url origin git@github.com:username_here/example.git
 </pre>


So now you have a repository that's different, what if you want to work with other people? Use git remote add to add their repository's to yours. Something like this will do:
 <pre>
 $git remote add upstream git@github.com:EdgeCaseBerg/example.git
 $git remote -v
  origin  git@github.com:your_user_name/example.git (fetch)
  origin  git@github.com:your_user_name/example.git (push)
  upstream  git@github.com:EdgeCaseBerg/example.git (fetch)
  upstream  git@github.com:EdgeCaseBerg/example.git (push)
 </pre>

That will add my repository as a remote to yours and git remote -v will list off your repositories. You'll notice that you'll get 2 times as many remotes as you might expect. This is because you have a url for "pushing" and for "fetching". Fetch is a new word, a fetch is similar to a pull with one major difference. A pull will grab changes from another repository and merge them into yours. A fetch will grab changes from the other repository and store them in something called FETCH_HEAD. Which you can then checkout using git checkout FETCH_HEAD to look around (or to check it out ha). Ito use fetch because it allows me to review the changes of another person before merging them into my repository. This is good for when you want to sign off or verify code before allowing it into a repository dedicated to stable versions of some code.

Here are the commands you need to know when dealing with remotes:
 <pre>
  $git pull remote_name branch_name
  $git push remote_name branch_name
  $git fetch remote_name branch_name
  $git checkout FETCH_HEAD
  $git merge --no-ff FETCH_HEAD
  $git branch
 </pre>

To find out a remote name, you can use git remote -v to list your remotes and their names will be on the left. The branch names can be listed by saying git branch. If you're working with code and you want to make sure that the code you're merging in is clearly coming from a branch other than the one you're merging into (such as a topic branch being merged into master), use the --no-ff argument to the merge command and you'll see a clear difference in gitk's log that will make it easy to distinguish when code was merged. If you don't use the --no-ff (which stands for no fast forward) then you'll "fast forward" the changes onto the branch, which will make it look like all the commits from the branch being merged took place on the branch you're merging into.



There's plenty more to git. Such as dealing with merging code and dealing with conflicts (git is smart enough to merge things automatically for you most of the time but sometimes it needs help) but this covers the basics. I recommend reading the [git pro book] as it is a fantastic overview of git and really helps people understand it.

[git pro book]:http://git-scm.com/book