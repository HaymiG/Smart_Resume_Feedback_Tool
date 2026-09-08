# End-to-End Test Plan: Enhanced Frontend UI

## Test Environment Setup
- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:5173
- **Test Date**: {{ DATE }}

## Test Scenarios

### 1. Valid Upload Flow
**Objective**: Verify complete flow from file selection to feedback display

**Steps**:
1. Navigate to http://localhost:5173
2. Verify dropzone is visible with text "Drag & drop your resume, or click to browse"
3. Verify subtext "PDF only, max 5MB" is displayed
4. Click on dropzone or drag a valid PDF file
5. Verify FileChip appears showing filename and file size
6. Verify "Analyze Resume" button is enabled
7. Click "Analyze Resume" button
8. Verify loading state appears with rotating messages
9. Wait for analysis to complete
10. Verify FeedbackDisplay renders with:
    - ScoreCard with circular progress ring
    - Score number displayed prominently (48px font)
    - Correct color coding (red <50, amber 50-74, emerald 75-100)
    - Three feedback sections: Formatting Issues, Missing Keywords, ATS Tips
    - Each section has icon, title, feedback text, and optional items list
    - "Analyze another resume" button at bottom

**Expected Results**:
- ✓ All UI components render correctly
- ✓ Score and feedback data display properly
- ✓ Color coding matches score ranges
- ✓ All sections are readable and properly formatted

---

### 2. Error Scenario: Invalid File Type
**Objective**: Test file type validation

**Steps**:
1. Navigate to http://localhost:5173
2. Select or drag a non-PDF file (e.g., .docx, .txt, .jpg)
3. Observe error handling

**Expected Results**:
- ✓ ErrorBanner displays: "Invalid file type. Only PDF files are allowed."
- ✓ File is not added to FileChip
- ✓ Analyze button remains disabled
- ✓ Error has red-tinted background with warning icon

---

### 3. Error Scenario: File Size Limit
**Objective**: Test file size validation

**Steps**:
1. Navigate to http://localhost:5173
2. Select or drag a PDF file larger than 5MB
3. Observe error handling

**Expected Results**:
- ✓ ErrorBanner displays: "File is too large. Max size is 5MB."
- ✓ File is not added to FileChip
- ✓ Analyze button remains disabled

---

### 4. Error Scenario: Network Error
**Objective**: Test network error handling

**Steps**:
1. Start frontend but stop backend service
2. Navigate to http://localhost:5173
3. Select a valid PDF file
4. Click "Analyze Resume"
5. Observe error handling

**Expected Results**:
- ✓ ErrorBanner displays network error message
- ✓ File remains selected (not cleared)
- ✓ User can retry by clicking "Analyze Resume" again
- ✓ Error is non-blocking (doesn't use modal)

---

### 5. Error Scenario: Backend Error (Empty PDF)
**Objective**: Test backend error handling for empty/scanned PDFs

**Steps**:
1. Navigate to http://localhost:5173
2. Select a scanned PDF or image-based PDF with no extractable text
3. Click "Analyze Resume"
4. Wait for backend response

**Expected Results**:
- ✓ ErrorBanner displays meaningful error from backend
- ✓ File remains selected for potential retry
- ✓ Error message is user-friendly

---

### 6. Reset and Re-upload Flow
**Objective**: Test reset functionality

**Steps**:
1. Complete a successful upload and view results
2. Scroll to bottom of FeedbackDisplay
3. Click "Analyze another resume" button
4. Verify return to initial state

**Expected Results**:
- ✓ Application returns to idle state with empty dropzone
- ✓ Previous feedback is cleared
- ✓ Previous file selection is cleared
- ✓ No errors displayed
- ✓ Can immediately upload a new file

---

### 7. File Removal Flow
**Objective**: Test file chip removal

**Steps**:
1. Navigate to http://localhost:5173
2. Select a valid PDF file
3. Verify FileChip displays with (×) button
4. Click the (×) button
5. Observe state change

**Expected Results**:
- ✓ FileChip disappears
- ✓ Dropzone reappears
- ✓ Can select another file
- ✓ Any previous errors are cleared

---

### 8. Responsive Behavior: Mobile (< 640px)
**Objective**: Test layout on mobile devices

**Steps**:
1. Navigate to http://localhost:5173
2. Open browser DevTools
3. Set viewport to iPhone SE (375 x 667)
4. Upload a resume and view results
5. Verify layout and readability

**Expected Results**:
- ✓ Dropzone is appropriately sized for mobile
- ✓ FileChip text doesn't overflow
- ✓ ScoreCard circular progress is visible and proportional
- ✓ Feedback sections stack vertically
- ✓ All text is readable without horizontal scrolling
- ✓ Buttons are touch-friendly (adequate size)
- ✓ Padding and margins are appropriate

---

### 9. Responsive Behavior: Tablet (640-1024px)
**Objective**: Test layout on tablet devices

**Steps**:
1. Navigate to http://localhost:5173
2. Set viewport to iPad (768 x 1024)
3. Upload a resume and view results
4. Verify layout and readability

**Expected Results**:
- ✓ Layout utilizes available space efficiently
- ✓ Max-width constraint (720px) is respected
- ✓ Content is centered horizontally
- ✓ All interactive elements are easily clickable

---

### 10. Responsive Behavior: Desktop (> 1024px)
**Objective**: Test layout on desktop screens

**Steps**:
1. Navigate to http://localhost:5173
2. Set viewport to 1920 x 1080
3. Upload a resume and view results
4. Verify layout and readability

**Expected Results**:
- ✓ Content is centered with appropriate max-width (720px)
- ✓ Generous whitespace on sides
- ✓ All components are properly aligned
- ✓ Text is comfortable to read (not stretched too wide)

---

### 11. Loading State Messages
**Objective**: Verify rotating status messages during analysis

**Steps**:
1. Navigate to http://localhost:5173
2. Select a valid PDF file
3. Click "Analyze Resume"
4. Observe loading state messages

**Expected Results**:
- ✓ Loading spinner is visible and animated
- ✓ Status messages rotate through:
  - "Reading your resume…"
  - "Scoring formatting…"
  - "Almost done…"
- ✓ Messages change approximately every 2 seconds
- ✓ Spinner uses emerald accent color (#0F766E)

---

### 12. Visual Design System Verification
**Objective**: Verify consistent application of design system

**Steps**:
1. Complete a full upload flow
2. Inspect visual elements

**Expected Results**:
- ✓ Background color is warm off-white (#FAFAF8)
- ✓ Text color is near-black (#0A0A0A)
- ✓ Score colors match ranges (red/amber/emerald)
- ✓ All cards have rounded-xl corners (16px)
- ✓ Soft shadows are applied consistently
- ✓ Hairline borders use low-opacity gray
- ✓ Generous whitespace between sections (24px)
- ✓ Typography is consistent and readable

---

### 13. Micro-interactions
**Objective**: Verify smooth hover states and transitions

**Steps**:
1. Navigate through the application
2. Hover over interactive elements

**Expected Results**:
- ✓ Dropzone border changes on hover
- ✓ Buttons show subtle background change on hover
- ✓ File chip × button shows hover effect
- ✓ "Analyze another resume" button shows hover effect
- ✓ All transitions are smooth (150-200ms)
- ✓ No jarring or excessive animations

---

### 14. Drag and Drop Interaction
**Objective**: Test drag-over visual feedback

**Steps**:
1. Navigate to http://localhost:5173
2. Drag a valid PDF file over the dropzone (don't release)
3. Observe visual feedback
4. Release file over dropzone
5. Verify file is selected

**Expected Results**:
- ✓ Dropzone border solidifies and changes color on drag-over
- ✓ Border returns to dashed when drag leaves
- ✓ File is properly captured on drop
- ✓ FileChip displays after drop

---

## Test Results Summary

| Test # | Test Name | Status | Notes |
|--------|-----------|--------|-------|
| 1 | Valid Upload Flow | [ ] | |
| 2 | Invalid File Type | [ ] | |
| 3 | File Size Limit | [ ] | |
| 4 | Network Error | [ ] | |
| 5 | Backend Error | [ ] | |
| 6 | Reset Flow | [ ] | |
| 7 | File Removal | [ ] | |
| 8 | Mobile Responsive | [ ] | |
| 9 | Tablet Responsive | [ ] | |
| 10 | Desktop Responsive | [ ] | |
| 11 | Loading Messages | [ ] | |
| 12 | Design System | [ ] | |
| 13 | Micro-interactions | [ ] | |
| 14 | Drag and Drop | [ ] | |

## Issues Found

| Issue # | Severity | Description | Component | Steps to Reproduce |
|---------|----------|-------------|-----------|-------------------|
| | | | | |

## Overall Assessment

**Pass Criteria**: All critical tests (1-7) must pass. At least 80% of all tests should pass.

**Result**: [ ] PASS / [ ] FAIL

**Notes**:

