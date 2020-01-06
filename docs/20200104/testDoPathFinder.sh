#!/bin/bash


################################################################################
# This script is used to do fast pathongen searching by mapping of the seq     #
# reads to bacteria genomes, by using tools including: Trimmomatic / bwa /     #
# samtools / bedtools /, etc. These softwares should be installed and fiexed   #
# before this script be applied.                                               #
#                                                                              #
# Usage: ./DoPathFinder.sh  <inputFileName>  <FolderNameForSeq>                #
# Input: files for seq description and name of the folder contains fastq files #
# Output:  <InputFile>_SepeciesCount.csv (top 20 species)                      #
#                                                                              #
# Author: Zhen Yang (Email: yangzhen@picb.ac.cn)                               #
# Date: 2017-12-12                                                             #
################################################################################

set -e
set -u

#source ./environment
######## fastqc results should be checked manually in visualization mode ########
######## to remove samples with low quality and do other quality control ########
PathDIR="/data/penggongxin/microbial-project/"
TrimmomaticPath=${PathDIR}"/software/Trimmomatic-0.38"
TrimmomaticAdap=${TrimmomaticPath}"/adapters"
#source ${PathDIR}/environment

baseDIR="/data/penggongxin/microbial-project"
sampleDIR=$2
sampleDec=$1
#sampleDec="samplefiles.txt"




####### Trimmomatic / BWA / samtools / bedtools / ####### 

cat ${baseDIR}/${sampleDec} | while read line  ### we can use each line as input for one sample (pair-end reads) thus to do parallel analysis
do
    R1ID=`echo $line |cut -d ' ' -f 1 `
    R2ID=`echo $line |cut -d ' ' -f 2 `
    sampleID=`echo $line |cut -d ' ' -f 3 `
    #sampleDIR=`echo $line |cut -d ' ' -f 3 `

    #date >> time.txt
    echo "####################################################"
    echo "########## Processing Sample: ${sampleID} ##########"
    echo "####################################################"

    ##########  Trimmomatic to remove adaptors and low quality reads ############对测序的reads进行质量检查，移除质量低的测序短序列
    java -jar  ${TrimmomaticPath}/trimmomatic-0.38.jar  PE -threads 36 -phred33  ${baseDIR}/${sampleDIR}/${R1ID}  ${baseDIR}/${sampleDIR}/${R2ID}   ${baseDIR}/${sampleDIR}/${sampleID}_clean1.fq  ${baseDIR}/${sampleDIR}/${sampleID}_unpaired1.fq  ${baseDIR}/${sampleDIR}/${sampleID}_clean2.fq  ${baseDIR}/${sampleDIR}/${sampleID}_unpaired2.fq   ILLUMINACLIP:${TrimmomaticAdap}/TruSeq3-PE.fa:2:30:10  LEADING:3 TRAILING:3 SLIDINGWINDOW:4:15 MINLEN:36
    echo "raw reads number: " > ${baseDIR}/${sampleDIR}/${sampleID}_reads_number.txt
#原始输入的测序短序列数目
    gunzip -c ${baseDIR}/${sampleDIR}/${R1ID} > ${baseDIR}/${sampleDIR}/temp

    wc -l ${baseDIR}/${sampleDIR}/temp  | awk '{print $1/4}' >>  ${baseDIR}/${sampleDIR}/${sampleID}_reads_number.txt
    rm ${baseDIR}/${sampleDIR}/temp
    
     echo "clean reads number: " >> ${baseDIR}/${sampleDIR}/${sampleID}_reads_number.txt 
#经过质量过滤后的质量数目
    wc -l ${baseDIR}/${sampleDIR}/${sampleID}_clean2.fq | awk '{print $1/4}' >>  ${baseDIR}/${sampleDIR}/${sampleID}_reads_number.txt 
 
    ########## bwa to mapping to human genome  ##########
#将质量检查过滤后的测序短序列先比对宿主人的基因组，把比对上宿主人的测序片段给过滤掉
  bwa mem -t 36 ${PathDIR}/H_sapiens/GRCh38_latest_genomic.fna  ${baseDIR}/${sampleDIR}/${sampleID}_clean1.fq  ${baseDIR}/${sampleDIR}/${sampleID}_clean2.fq  >  ${baseDIR}/${sampleDIR}/${sampleID}_mem-pe.sam

    ########## samtools to screen non-human reads  ##########
  /data/software/samtools-1.8/samtools-1.8/samtools view -f 12 -S -h -b -@ 36 ${baseDIR}/${sampleDIR}/${sampleID}_mem-pe.sam | /data/software/samtools-1.8/samtools-1.8/samtools sort -n -@ 36 -o ${baseDIR}/${sampleDIR}/${sampleID}_filterSorted.bam

    ########## bedtools to get fq with filterd reads  ##########
    bedtools bamtofastq -i ${baseDIR}/${sampleDIR}/${sampleID}_filterSorted.bam  -fq ${baseDIR}/${sampleDIR}/${sampleID}_filtered1.fq -fq2 ${baseDIR}/${sampleDIR}/${sampleID}_filtered2.fq
   echo "alignment reads number: " >> ${baseDIR}/${sampleDIR}/${sampleID}_reads_number.txt 
   wc -l ${baseDIR}/${sampleDIR}/${sampleID}_filtered1.fq | awk '{print $1/4}' >>  ${baseDIR}/${sampleDIR}/${sampleID}_reads_number.txt
  #把比对上宿主人基因组的测序短序列过滤后，还剩下的测序短序列数目
    ########## bwa to mapping to bacteria fun vir arc genomes  ##########
    bwa mem -t 36  ${PathDIR}/RefGenome/Gb_Arc_Bac_Fun_Vir_noplasmid.fa  ${baseDIR}/${sampleDIR}/${sampleID}_filtered1.fq  ${baseDIR}/${sampleDIR}/${sampleID}_filtered2.fq  >  ${baseDIR}/${sampleDIR}/${sampleID}_Gb_Arc_Bac_Fun_Vir_mem-pe.sam
#将剩下的测序短序列跟所有的微生物基因组比对，找出病原微生物
    ##########  get unique mapping reads ##########
    /data/software/samtools-1.8/samtools-1.8/samtools view -G 12  -S -b -@ 36 ${baseDIR}/${sampleDIR}/${sampleID}_Gb_Arc_Bac_Fun_Vir_mem-pe.sam | /data/software/samtools-1.8/samtools-1.8/samtools sort -n -@ 36 -o ${baseDIR}/${sampleDIR}/${sampleID}_Gb_Arc_Bac_Fun_Vir_filterSorted.bam
    /data/software/samtools-1.8/samtools-1.8/samtools view  ${baseDIR}/${sampleDIR}/${sampleID}_Gb_Arc_Bac_Fun_Vir_filterSorted.bam  >  ${baseDIR}/${sampleDIR}/${sampleID}_Gb_Arc_Bac_Fun_Vir_filterSorted.sam

    ##########  sort mapping results  ########## 
    cut -f 1,3  ${baseDIR}/${sampleDIR}/${sampleID}_Gb_Arc_Bac_Fun_Vir_filterSorted.sam | sort -u > ${baseDIR}/${sampleDIR}/${sampleID}_Gb_Arc_Bac_Fun_Vir_mapinfo.txt

    ##########  Reads count for species  ##########
    /data/software/R/R-3.4.3/bin/Rscript  testpraseResult.R ${PathDIR}  ${baseDIR} ${sampleDIR} ${sampleID}
    /data/software/R/R-3.4.3/bin/Rscript  getpraseResult.R ${PathDIR}  ${baseDIR} ${sampleDIR} ${sampleID} 
   # /data/software/R/R-3.4.3/bin/Rscript  testpraseResult.R ${PathDIR}  ${baseDIR} ${sampleDIR} ${sampleID}
   # date >> time.txt
done
# 对比对上的病原微生物用R统计比对的数目和微生物物种
####### Trimmomatic / BWA / samtools / bedtools  #######


