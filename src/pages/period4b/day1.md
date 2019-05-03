---
period: "Flow 4b"
title: "GraphQL"
date: "07-05-2019"
pageintro: | 
   An introduction to GraphQL
   
   Setting up a simple GraphQL backend with an Express Server and a Mongo Database
---



### Before this lesson you should:
<!--readings_begin-->
- :book: First part of this tutorial [How to GraphQL (42 min.)]( https://www.howtographql.com/) (Skip the Advanced part, we are doing this as in the tutorial below)
- :tv: Watch and CODE ALONG this GREAT [tutorial (90 min)](https://www.lynda.com/GraphQL-tutorials/GraphQL-Essential-Training/614315-2.html) (It will give you all most everything you need to design the miniproject GraphQL backend)
<!--readings_end-->

#### Hints for the Lynda-tutorial (read this before you start)
- The tutorial uses two databases, to really illustrate the power of GraphQL. Skip the part related to relational databases (SQL) and anything related to the *Aliens* model, and focus only on the parts related to **MongoDB**
- The tutorial includes a section related to, how you set up a local instance of MongoDB. I suggest you stick to your Cloud Based MongoDB Atlas Account and create a new database up there for this exercise.
- Also skip the part (4.1) that install Robo 3T, since Atlas provides a fine enough GUI
- It seems like the authour haven't noticed that mongoose now support promises. So when you get to the "mongoose-part" instead of doing something like this:
````javascript
return new Promise((resolve, object) => {
                newFriend.save((err) => {
                    if (err) reject(err)
                    else resolve(newFriend)
                })
            }) 
````
you can just do this (but please observe that the example above, nicely illustrates how you can convert a callback-based design into a promise-based):

````javascript 
return newFriend.save();
````

### Exercises
<!--exercises_begin-->
- Complete the  [Lynda-tutorial](https://www.lynda.com/GraphQL-tutorials/GraphQL-Essential-Training/614315-2.html).
- If you have completed the Lynda-tutorial, go to the next lesson and start with the GraphQL backend for the mini project.
<!--exercises_end-->

#### Slides
[slides](https://docs.google.com/presentation/d/1Uc6r_hDfaOX0XiDidJblAd_x613hKKZU1JtbSe5DjMM/edit?usp=sharing)

