package distributed

import (
	"math"
	"math/rand"
)

// Group ...
type Group struct {
	Skip  int
	Limit int
	Order int
	IDs   []int
}

// Map ...
type Map map[string]*Group

// Populate fills all groups with ids based on their size
func (grp Map) Populate() Map {
	allIds := make(map[int]bool)
	for _, v := range grp {
		ids := make(map[int]bool)
		for len(ids) < len(v.IDs) {
			val := rand.Intn(10000)
			_, allHas := allIds[val]
			_, idsHas := ids[val]

			if allHas || idsHas {
				continue
			}

			allIds[val] = true
			ids[val] = true
		}

		lastAssigned := 0
		for k := range ids {
			v.IDs[lastAssigned] = k
			lastAssigned++
		}
	}

	return grp
}

// ResetRanges ...
func (grp Map) ResetRanges() Map {
	for _, g := range grp {
		g.Skip, g.Limit = 0, 0
	}

	return grp
}

// FillRanges ...
func (grp Map) FillRanges(page, size int) Map {

	groupCount := len(grp)
	groups := make([]*Group, 0)
	for _, g := range grp {
		groups = append(groups, g)
	}

	for index := range groups {
		endIndex := groupCount - index - 1
		for i := 0; i < endIndex; i++ {
			a, b := groups[i], groups[i+1]
			if a.Order > b.Order {
				groups[i], groups[i+1] = groups[i+1], groups[i]
			}
		}
	}

	// page-specific details
	startIndex := page * size
	endIndex := startIndex + size

	// how many ids have been scanned
	offset := 0
	poolSize := size

	for _, v := range groups {

		// 0-33
		groupLen := len(v.IDs)
		// start, end are the "start index" and "end index" of this group range
		// eg: Offset 20, len 33: 20 -> 53
		groupStart, groupEnd := offset, offset+groupLen

		if groupStart > endIndex || groupEnd <= startIndex {
			offset += len(v.IDs)
			v.Skip, v.Limit = 0, 0
			continue
		}

		rightBound := int(math.Min(float64(groupEnd), float64(endIndex)))
		leftBound := int(math.Max(float64(groupStart), float64(startIndex)))

		if v.Skip = startIndex - groupStart; v.Skip < 0 {
			v.Skip = 0
		}

		if v.Limit = rightBound - leftBound; v.Limit > poolSize {
			v.Limit = poolSize
		}

		offset += len(v.IDs)
		poolSize -= v.Limit
	}

	return grp
}
