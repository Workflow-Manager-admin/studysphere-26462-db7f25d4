#!/bin/bash
cd /home/kavia/workspace/code-generation/studysphere-26462-db7f25d4/study_sphere
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

