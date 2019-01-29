# social-sim
Attempting to use various methods to extract interesting and dynamic social behaviors from a multi-agent system.

Live Demo: https://HoomanFarhadi.github.io/social-sim

### High Level Explanation

This is a simplistic model of how a set of agents might socially interact with each other in a bounded environment. Each agent in this environment will have parameters that define its unique attributes, such personality and appearance. The agent will also have another set of values that define its preferences in regards to the personalities and appearances of other agents. The agent will have a "social fear" parameter, signifying how disinclined that agent will be to approaching and conversing with other agents. Moreover, each agent will have a curiosity parameter, which signifies its willingness to try new actions and disinclination towards old repetitive ones.

Once the simulation is executed, new agents will be spawned into the environment at a rate inversely proportional the number of agents currently in the environment. Once in the environment, the agents can choose to approach other agents. If two agents are close enough to each other and there is a mutual desire to approach one another, the agents will talk to each other. At any point, the agents can choose to not approach or talk to any other agent, and instead remain alone, in which case they will make a move in a random direction. Each agent's decision making process is influenced by a multitude of factors, including the ones mentioned above.

### How to Use

### Initial Observations

### Next Steps
