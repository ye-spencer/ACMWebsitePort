# Contributing Notes

Hi! Thanks for being interested in contributing to the ACM Website!

This project will be similar to a open-source project, where you identify something that needs work, develop it, and create a pull request, and we'll get around to reviewing it.

Below are a bunch of features that we will hopefully get done before the start of the semester next year, so we will be able to deploy it. Once you decide on something to work on (or you've already been working on it), email <jhuacmofficers@gmail.com>, and we'll put your name next to the feature so no duplicate work happens.

If you have any questions, feel free to email us at <jhuacmofficers@gmail.com>

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)
- Git

### Setup Instructions

1. Fork and clone the repository
2. Install dependencies:

   ```bash
   # Install root dependencies
   npm install
   
   # Install backend dependencies
   cd acm_backend
   npm install
   
   # Install frontend dependencies
   cd ../acm_website
   npm install
   ```

3. Start the development servers:

   ```bash
   # Terminal 1 - Backend
   cd acm_backend
   npm run dev
   
   # Terminal 2 - Frontend
   cd acm_website
   npm run dev
   ```

### Development Guidelines

- Follow the existing code style and formatting
- Write meaningful commit messages
- Create feature branches for your work
- Test your changes thoroughly
- Update documentation as needed

## Features

### Home Page

A homepage with links to all other important aspects of the website

**Existing Functionality:**

- Navigation menu (Shreyasi)
- Hero section with ACM mission statement (Ria)
- Quick links to important sections (Ria)

**Possible Components:**

- News/announcements section
- Footer with contact information


### Events Page

A page containing upcoming events with a register link, along with relevant information. Should be easy to update without directly editing code.

**Existing Functionality:**

- Event listing with dates, times, and locations (Shreyasi)
- Past events archive (Shreyasi)
- Registration system integration (Shreyasi)
- Event categories/tags (Shreyasi)

**Possible Components:**

- Event details page

### About Us

Basic contact page with officer information

**Existing Functionality:**

- Current/Historical officer profiles (Alan)
- ACM mission and vision  (Ria)
- Contact information (Ria)
- Social media links (Ria)

**Possible Components:**

- Committee information
- History of ACM at JHU

### Accounts/Register/Signup [COMPLETE]

Likely the most complex part of the website (but not that complex still). Students should be able to register to become a ACM member with an email/password, this allows them to join the new mailing list (just some database) and become part of our records (records includes events attended).

**Existing Functionality:**

- Sign up, sign in (Ria)
- Booking management on profile page (Ria)
- Event management on profile page (Ria)
- Event attendance tracking (Ria)
- Membership request (Ria)
- Mailing list subscription management (Ria)


### Admin Dashboard [COMPLETE]

**Existing Functionality:**

- Event creation (Ria)
- Member management (Ria)
- Attendance upload (Ria)


### Booking ACM Lounge [COMPLETE]

A page that allows members to book the ACM lounge for a period of time, and also has a schedule of when it is already booked

**Existing Functionality:**

- Available and unavailable times with dates/times (Ria)
- Limit of registration time/occurrences (Ria)


### Sponsor Page

A page containing information about our sponsors

**Possible Components:**

- A reusable component to use for each of our sponsors
- Two tiers, one for our partners and one for standard sponsors

### Whatever else you think

I'm writing this document off 5 hours of sleep on a Delta Airlines flight, I've definitely missed stuff, and there's also probably a lot of stuff that none of us have thought about yet. Implement anything you think is going to be good.

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the documentation with any new features or changes
3. Request review from at least one officer

## Need Help?

- Email us at <jhuacmofficers@gmail.com>
- Schedule a meeting with officers for guidance
