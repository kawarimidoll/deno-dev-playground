#!/bin/bash
set -v
deno fmt ./**
deno lint ./**
